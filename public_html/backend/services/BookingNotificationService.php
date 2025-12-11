<?php
/**
 * Booking Notification Service
 * Handles sending notifications when bookings are created or updated
 */

require_once __DIR__ . '/../database/config.php';
require_once __DIR__ . '/../libs/EmailService.php';

class BookingNotificationService {

    private $pdo;
    private $emailService;

    public function __construct() {
        $this->pdo = getDBConnection();
        $this->emailService = new EmailService();
    }

    /**
     * Send notification for new booking
     */
    public function notifyNewBooking($bookingId) {
        try {
            // Get booking details with client and car information
            $bookingData = $this->getBookingDetails($bookingId);

            if (!$bookingData) {
                return [
                    'success' => false,
                    'message' => 'Booking not found'
                ];
            }

            // Send notification to admin
            $adminResult = $this->emailService->sendBookingNotification($bookingData);

            // Send confirmation to client if email is available
            $clientResult = null;
            if (!empty($bookingData['client_email'])) {
                $clientResult = $this->emailService->sendBookingConfirmation($bookingData, $bookingData['client_email']);
            }

            // Log notification in database
            $this->logNotification($bookingId, 'email', ADMIN_EMAIL, BOOKING_NOTIFICATION_SUBJECT, 'Admin notification sent', $adminResult['success'] ? 'sent' : 'failed');

            if ($clientResult) {
                $this->logNotification($bookingId, 'email', $bookingData['client_email'], BOOKING_CONFIRMATION_SUBJECT, 'Client confirmation sent', $clientResult['success'] ? 'sent' : 'failed');
            }

            return [
                'success' => $adminResult['success'],
                'message' => $adminResult['message'],
                'admin_notification' => $adminResult,
                'client_confirmation' => $clientResult
            ];

        } catch (Exception $e) {
            error_log('Booking notification error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to send booking notification: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get complete booking details for notification
     */
    private function getBookingDetails($bookingId) {
        $sql = "
            SELECT
                b.*,
                c.name as client_name,
                c.email as client_email,
                c.phone as client_phone,
                car.name as car_name,
                car.category as car_category,
                car.transmission as car_transmission,
                car.fuel_type as car_fuel_type
            FROM bookings b
            LEFT JOIN clients c ON b.client_id = c.id
            LEFT JOIN cars car ON b.car_id = car.id
            WHERE b.id = ?
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$bookingId]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);

        return $booking ?: null;
    }

    /**
     * Log notification in database
     */
    private function logNotification($bookingId, $type, $recipient, $subject, $message, $status) {
        try {
            $sql = "
                INSERT INTO notifications
                (booking_id, notification_type, recipient, subject, message, status, sent_at, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            ";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$bookingId, $type, $recipient, $subject, $message, $status]);

        } catch (Exception $e) {
            error_log('Failed to log notification: ' . $e->getMessage());
        }
    }

    /**
     * Test email functionality
     */
    public function testEmailNotification() {
        $testData = [
            'booking_number' => 'BK20251210001',
            'client_name' => 'Test Client',
            'client_email' => 'test@example.com',
            'client_phone' => '+40 123 456 789',
            'car_name' => 'Audi A3 TFSI',
            'pickup_location' => 'Satu Mare Airport',
            'pickup_date' => '2025-12-15',
            'pickup_time' => '10:00',
            'dropoff_location' => 'Satu Mare Airport',
            'dropoff_date' => '2025-12-20',
            'dropoff_time' => '10:00',
            'duration_days' => 5,
            'total_cost_eur' => 250.00,
            'total_cost_ron' => 1250.00,
            'status' => 'pending',
            'payment_status' => 'pending'
        ];

        return $this->emailService->sendBookingNotification($testData);
    }
}
?>