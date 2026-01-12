<?php
/**
 * Contact Form Email API Endpoint
 * Handles sending contact form messages to admin
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON response header
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit();
}

try {
    // Load email service
    require_once __DIR__ . '/../libs/EmailService.php';

    // Get POST data
    $rawData = file_get_contents('php://input');
    $contactData = json_decode($rawData, true);

    // Validate required fields
    $requiredFields = ['name', 'email', 'phone', 'message'];
    $missingFields = [];

    foreach ($requiredFields as $field) {
        if (!isset($contactData[$field]) || empty(trim($contactData[$field]))) {
            $missingFields[] = $field;
        }
    }

    if (!empty($missingFields)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields: ' . implode(', ', $missingFields)
        ]);
        exit();
    }

    // Sanitize inputs
    $contactData['name'] = htmlspecialchars(trim($contactData['name']), ENT_QUOTES, 'UTF-8');
    $contactData['email'] = filter_var(trim($contactData['email']), FILTER_SANITIZE_EMAIL);
    $contactData['phone'] = htmlspecialchars(trim($contactData['phone']), ENT_QUOTES, 'UTF-8');
    $contactData['message'] = htmlspecialchars(trim($contactData['message']), ENT_QUOTES, 'UTF-8');

    // Subject is optional
    if (isset($contactData['subject'])) {
        $contactData['subject'] = htmlspecialchars(trim($contactData['subject']), ENT_QUOTES, 'UTF-8');
    }

    // Validate email format
    if (!filter_var($contactData['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email address format'
        ]);
        exit();
    }

    // Validate message length
    if (strlen($contactData['message']) < 10) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Message is too short (minimum 10 characters)'
        ]);
        exit();
    }

    if (strlen($contactData['message']) > 5000) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Message is too long (maximum 5000 characters)'
        ]);
        exit();
    }

    // Initialize email service
    $emailService = new EmailService();

    // Send contact message to admin
    $result = $emailService->sendContactMessage($contactData);

    if ($result['success']) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Your message has been sent successfully. We will contact you soon!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send message. Please try again later.',
            'details' => $result['message']
        ]);
    }

} catch (Exception $e) {
    // Log error to file
    $errorLog = __DIR__ . '/../../logs/contact-errors.log';
    $errorDir = dirname($errorLog);
    if (!is_dir($errorDir)) {
        @mkdir($errorDir, 0755, true);
    }

    $errorMessage = date('Y-m-d H:i:s') . " - " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine() . "\n";
    @file_put_contents($errorLog, $errorMessage, FILE_APPEND);

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error occurred. Please try again later.',
        'details' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => explode("\n", $e->getTraceAsString())
    ]);
}
?>
