<?php
/**
 * Public Contact API
 * Handles contact form submissions from the website
 *
 * Features:
 * - Saves contact message to database
 * - Sends email notification to admin
 * - Logs email activity
 */

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set error log
$logFile = __DIR__ . '/../../logs/contact-api.log';
if (!is_dir(dirname($logFile))) {
    mkdir(dirname($logFile), 0755, true);
}
ini_set('error_log', $logFile);

// CORS headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit();
}

try {
    // Load dependencies
    require_once __DIR__ . '/../../libs/Database.php';
    require_once __DIR__ . '/../../libs/EmailService.php';
    require_once __DIR__ . '/../../libs/ReCaptcha.php';

    // Get POST data
    $rawData = file_get_contents('php://input');
    error_log('[Contact API] Received data: ' . substr($rawData, 0, 200));

    $data = json_decode($rawData, true);

    if (!$data) {
        throw new Exception('Invalid JSON data: ' . json_last_error_msg());
    }

    // Validate reCAPTCHA token
    $recaptchaToken = isset($data['recaptcha_token']) ? $data['recaptcha_token'] : null;
    $recaptcha = new ReCaptcha();
    $recaptchaResult = $recaptcha->verify($recaptchaToken, 'contact_form');

    if (!$recaptchaResult['success']) {
        error_log('[Contact API] reCAPTCHA failed: ' . $recaptchaResult['error']);
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Verificarea reCAPTCHA a eșuat. Vă rugăm să reîncărcați pagina și să încercați din nou.',
            'error' => 'recaptcha_failed'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    error_log('[Contact API] reCAPTCHA passed with score: ' . $recaptchaResult['score']);

    // Validate required fields
    $required = ['name', 'email', 'message'];
    $missing = [];

    foreach ($required as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $missing[] = $field;
        }
    }

    if (!empty($missing)) {
        throw new Exception('Missing required fields: ' . implode(', ', $missing));
    }

    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email address');
    }

    // Sanitize inputs
    $name = trim($data['name']);
    $email = trim($data['email']);
    $phone = isset($data['phone']) ? trim($data['phone']) : null;
    $subject = isset($data['subject']) ? trim($data['subject']) : null;
    $message = trim($data['message']);

    // Get metadata
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    $language = $data['language'] ?? 'ro';
    $sourcePage = $data['source_page'] ?? $_SERVER['HTTP_REFERER'] ?? null;

    // Get database instance
    $db = Database::getInstance();

    // Start transaction
    $db->beginTransaction();

    try {
        // Step 1: Save contact message to database
        error_log('[Contact API] Saving contact message from: ' . $email);

        $messageId = $db->insert(
            "INSERT INTO contact_messages (
                name, email, phone, subject, message,
                status, ip_address, user_agent, language, source_page, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
            [
                $name,
                $email,
                $phone,
                $subject,
                $message,
                'new',
                $ipAddress,
                $userAgent,
                $language,
                $sourcePage
            ]
        );

        error_log('[Contact API] Message saved with ID: ' . $messageId);

        // Step 2: Send email notification to admin
        $emailService = new EmailService();

        $contactData = [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'subject' => $subject,
            'message' => $message
        ];

        error_log('[Contact API] Sending email notification to admin...');
        $emailResult = $emailService->sendContactMessage($contactData);

        // Log email notification
        $db->insert(
            "INSERT INTO notifications (
                contact_message_id, notification_type, notification_category,
                recipient, subject, message, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
            [
                $messageId,
                'email',
                'contact_message',
                getenv('ADMIN_EMAIL') ?: 'admin@veironauto.ro',
                'New Contact Message from ' . $name,
                'Contact form notification sent to admin',
                $emailResult['success'] ? 'sent' : 'failed'
            ]
        );

        // Commit transaction
        $db->commit();

        // Return success response
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => $language === 'en'
                ? 'Your message has been sent successfully! We will contact you soon.'
                : 'Mesajul dumneavoastră a fost trimis cu succes! Vă vom contacta în curând.',
            'data' => [
                'message_id' => $messageId,
                'email_sent' => $emailResult['success']
            ]
        ], JSON_UNESCAPED_UNICODE);

        error_log('[Contact API] Success! Message ID: ' . $messageId);

    } catch (Exception $e) {
        // Rollback on error
        $db->rollback();
        throw $e;
    }

} catch (Exception $e) {
    error_log('[Contact API] Error: ' . $e->getMessage());
    error_log('[Contact API] Trace: ' . $e->getTraceAsString());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'A apărut o eroare la trimiterea mesajului. Vă rugăm să încercați din nou.',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
