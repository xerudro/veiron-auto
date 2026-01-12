<?php
/**
 * Booking Email API Endpoint
 * Handles sending booking notifications and confirmations
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
    $bookingData = json_decode($rawData, true);

    // Validate required fields
    $requiredFields = [
        'booking_number',
        'client_name',
        'client_email',
        'client_phone',
        'car_name',
        'pickup_location',
        'pickup_date',
        'pickup_time',
        'dropoff_location',
        'dropoff_date',
        'dropoff_time',
        'duration_days',
        'total_cost_eur',
        'total_cost_ron'
    ];

    $missingFields = [];
    foreach ($requiredFields as $field) {
        if (!isset($bookingData[$field]) || empty($bookingData[$field])) {
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

    // Validate email format
    if (!filter_var($bookingData['client_email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email address'
        ]);
        exit();
    }

    // Add default values for optional fields
    $bookingData['status'] = $bookingData['status'] ?? 'Pending';
    $bookingData['payment_status'] = $bookingData['payment_status'] ?? 'Pending';

    // Get language from booking data (default to 'ro')
    $language = $bookingData['language'] ?? 'ro';

    // Validate language (only 'ro' or 'en' allowed)
    if (!in_array($language, ['ro', 'en'])) {
        $language = 'ro';
    }

    // Initialize email service
    $emailService = new EmailService();

    // Send notification to admin (always in Romanian)
    $adminResult = $emailService->sendBookingNotification($bookingData);

    // Send confirmation to client (in the language they used)
    $clientResult = $emailService->sendBookingConfirmation(
        $bookingData,
        $bookingData['client_email'],
        $language
    );

    // Check results
    if ($adminResult['success'] && $clientResult['success']) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Booking emails sent successfully',
            'details' => [
                'admin_notification' => $adminResult['message'],
                'client_confirmation' => $clientResult['message']
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send one or more emails',
            'details' => [
                'admin_notification' => $adminResult,
                'client_confirmation' => $clientResult
            ]
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?>
