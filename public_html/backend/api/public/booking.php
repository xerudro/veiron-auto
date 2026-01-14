<?php
/**
 * Public Booking API
 * Handles booking submissions from the website
 *
 * Features:
 * - Saves booking to database
 * - Creates/updates client record
 * - Sends email notifications (admin + client)
 * - Logs all email activity
 */

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set error log
$logFile = __DIR__ . '/../../logs/booking-api.log';
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
    error_log('[Booking API] Received data: ' . substr($rawData, 0, 500));

    $data = json_decode($rawData, true);

    if (!$data) {
        throw new Exception('Invalid JSON data: ' . json_last_error_msg());
    }

    // Validate reCAPTCHA token
    $recaptchaToken = isset($data['recaptcha_token']) ? $data['recaptcha_token'] : null;
    $recaptcha = new ReCaptcha();
    $recaptchaResult = $recaptcha->verify($recaptchaToken, 'booking_form');

    if (!$recaptchaResult['success']) {
        error_log('[Booking API] reCAPTCHA failed: ' . $recaptchaResult['error']);
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Verificarea reCAPTCHA a eșuat. Vă rugăm să reîncărcați pagina și să încercați din nou.',
            'error' => 'recaptcha_failed'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    error_log('[Booking API] reCAPTCHA passed with score: ' . $recaptchaResult['score']);

    // Validate required fields
    $required = [
        'booking_number', 'client_name', 'client_email', 'client_phone',
        'car_name', 'pickup_location', 'pickup_date', 'pickup_time',
        'dropoff_location', 'dropoff_date', 'dropoff_time',
        'duration_days', 'total_cost_eur', 'total_cost_ron'
    ];

    $missing = [];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            $missing[] = $field;
        }
    }

    if (!empty($missing)) {
        throw new Exception('Missing required fields: ' . implode(', ', $missing));
    }

    // Validate email
    if (!filter_var($data['client_email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email address');
    }

    // Get database instance
    $db = Database::getInstance();

    // Start transaction
    $db->beginTransaction();

    try {
        // Step 1: Get or create client
        error_log('[Booking API] Processing client: ' . $data['client_email']);

        // Split client name
        $nameParts = explode(' ', $data['client_name'], 2);
        $firstName = $nameParts[0];
        $lastName = $nameParts[1] ?? '';

        // Check if client exists
        $client = $db->queryOne(
            "SELECT id FROM clients WHERE email = ? LIMIT 1",
            [$data['client_email']]
        );

        if ($client) {
            $clientId = $client['id'];
            error_log('[Booking API] Existing client found: ' . $clientId);

            // Update client info
            $db->execute(
                "UPDATE clients SET first_name = ?, last_name = ?, phone = ?, updated_at = NOW() WHERE id = ?",
                [$firstName, $lastName, $data['client_phone'], $clientId]
            );
        } else {
            // Create new client
            $clientId = $db->insert(
                "INSERT INTO clients (first_name, last_name, email, phone, created_at) VALUES (?, ?, ?, ?, NOW())",
                [$firstName, $lastName, $data['client_email'], $data['client_phone']]
            );
            error_log('[Booking API] New client created: ' . $clientId);
        }

        // Step 2: Find car by name (simplified lookup)
        // For now, we'll store car_name as text. Later we can add proper car matching.
        $carId = null; // Will be null until we implement proper car management

        // Step 3: Save booking
        error_log('[Booking API] Saving booking: ' . $data['booking_number']);

        $bookingId = $db->insert(
            "INSERT INTO bookings (
                booking_number, client_id, car_id, pickup_location, dropoff_location,
                pickup_date, pickup_time, dropoff_date, dropoff_time, duration_days,
                base_rate_eur, total_cost_eur, total_cost_ron,
                status, payment_status, booking_source, notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
            [
                $data['booking_number'],
                $clientId,
                $carId, // NULL for now
                $data['pickup_location'],
                $data['dropoff_location'],
                $data['pickup_date'],
                $data['pickup_time'],
                $data['dropoff_date'],
                $data['dropoff_time'],
                $data['duration_days'],
                $data['total_cost_eur'], // Using total as base for now
                $data['total_cost_eur'],
                $data['total_cost_ron'],
                'pending',
                'pending',
                'online',
                'Car: ' . $data['car_name'] // Store car name in notes for now
            ]
        );

        error_log('[Booking API] Booking saved with ID: ' . $bookingId);

        // Step 4: Send emails
        $emailService = new EmailService();

        // Send admin notification
        error_log('[Booking API] Sending admin notification...');
        $adminResult = $emailService->sendBookingNotification($data);

        // Log admin email
        $db->insert(
            "INSERT INTO notifications (
                booking_id, notification_type, notification_category, recipient,
                subject, message, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
            [
                $bookingId,
                'email',
                'booking_notification',
                getenv('ADMIN_EMAIL') ?: 'admin@veironauto.ro',
                'New Booking: ' . $data['booking_number'],
                'Booking notification sent to admin',
                $adminResult['success'] ? 'sent' : 'failed'
            ]
        );

        // Send client confirmation
        error_log('[Booking API] Sending client confirmation...');
        $language = $data['language'] ?? 'ro';
        $clientResult = $emailService->sendBookingConfirmation($data, $data['client_email'], $language);

        // Log client email
        $db->insert(
            "INSERT INTO notifications (
                booking_id, notification_type, notification_category, recipient,
                subject, message, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
            [
                $bookingId,
                'email',
                'booking_confirmation',
                $data['client_email'],
                'Booking Confirmation: ' . $data['booking_number'],
                'Booking confirmation sent to client',
                $clientResult['success'] ? 'sent' : 'failed'
            ]
        );

        // Commit transaction
        $db->commit();

        // Return success response
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Booking created successfully',
            'data' => [
                'booking_id' => $bookingId,
                'booking_number' => $data['booking_number'],
                'client_id' => $clientId,
                'email_status' => [
                    'admin_notification' => $adminResult['success'],
                    'client_confirmation' => $clientResult['success']
                ]
            ]
        ], JSON_UNESCAPED_UNICODE);

        error_log('[Booking API] Success! Booking ID: ' . $bookingId);

    } catch (Exception $e) {
        // Rollback on error
        $db->rollback();
        throw $e;
    }

} catch (Exception $e) {
    error_log('[Booking API] Error: ' . $e->getMessage());
    error_log('[Booking API] Trace: ' . $e->getTraceAsString());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ], JSON_UNESCAPED_UNICODE);
}
?>
