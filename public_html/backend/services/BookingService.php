<?php
/**
 * Sample Booking Creation with Email Notifications
 * Example integration for Phase 2 API development
 */

require_once __DIR__ . '/../database/config.php';
require_once __DIR__ . '/../services/BookingNotificationService.php';

class BookingService {

    private $pdo;
    private $notificationService;

    public function __construct() {
        $this->pdo = getDBConnection();
        $this->notificationService = new BookingNotificationService();
    }

    /**
     * Create a new booking with automatic notifications
     */
    public function createBooking($bookingData) {
        try {
            $this->pdo->beginTransaction();

            // Insert booking
            $sql = "
                INSERT INTO bookings (
                    booking_number, client_id, car_id, pickup_location, dropoff_location,
                    pickup_date, pickup_time, dropoff_date, dropoff_time, duration_days,
                    base_rate_eur, insurance_cost_eur, additional_services_cost_eur,
                    total_cost_eur, total_cost_ron, status, payment_status,
                    booking_source, created_at, updated_at
                ) VALUES (
                    :booking_number, :client_id, :car_id, :pickup_location, :dropoff_location,
                    :pickup_date, :pickup_time, :dropoff_date, :dropoff_time, :duration_days,
                    :base_rate_eur, :insurance_cost_eur, :additional_services_cost_eur,
                    :total_cost_eur, :total_cost_ron, :status, :payment_status,
                    :booking_source, NOW(), NOW()
                )
            ";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                'booking_number' => $bookingData['booking_number'],
                'client_id' => $bookingData['client_id'] ?? null,
                'car_id' => $bookingData['car_id'],
                'pickup_location' => $bookingData['pickup_location'],
                'dropoff_location' => $bookingData['dropoff_location'],
                'pickup_date' => $bookingData['pickup_date'],
                'pickup_time' => $bookingData['pickup_time'],
                'dropoff_date' => $bookingData['dropoff_date'],
                'dropoff_time' => $bookingData['dropoff_time'],
                'duration_days' => $bookingData['duration_days'],
                'base_rate_eur' => $bookingData['base_rate_eur'],
                'insurance_cost_eur' => $bookingData['insurance_cost_eur'] ?? 0,
                'additional_services_cost_eur' => $bookingData['additional_services_cost_eur'] ?? 0,
                'total_cost_eur' => $bookingData['total_cost_eur'],
                'total_cost_ron' => $bookingData['total_cost_ron'],
                'status' => $bookingData['status'] ?? 'pending',
                'payment_status' => $bookingData['payment_status'] ?? 'pending',
                'booking_source' => $bookingData['booking_source'] ?? 'online'
            ]);

            $bookingId = $this->pdo->lastInsertId();

            $this->pdo->commit();

            // Send notifications
            $notificationResult = $this->notificationService->notifyNewBooking($bookingId);

            return [
                'success' => true,
                'booking_id' => $bookingId,
                'booking_number' => $bookingData['booking_number'],
                'notifications' => $notificationResult
            ];

        } catch (Exception $e) {
            $this->pdo->rollBack();
            return [
                'success' => false,
                'message' => 'Failed to create booking: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Generate unique booking number
     */
    public function generateBookingNumber() {
        $date = date('Ymd');
        $random = str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        return 'BK' . $date . $random;
    }
}

// Example usage
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sample booking data (would come from API request)
    $bookingData = [
        'booking_number' => (new BookingService())->generateBookingNumber(),
        'client_id' => 1, // Would be determined from client data
        'car_id' => 1,
        'pickup_location' => 'Satu Mare Airport',
        'dropoff_location' => 'Satu Mare Airport',
        'pickup_date' => '2025-12-15',
        'pickup_time' => '10:00:00',
        'dropoff_date' => '2025-12-20',
        'dropoff_time' => '10:00:00',
        'duration_days' => 5,
        'base_rate_eur' => 200.00,
        'insurance_cost_eur' => 25.00,
        'additional_services_cost_eur' => 0.00,
        'total_cost_eur' => 225.00,
        'total_cost_ron' => 1125.00,
        'status' => 'pending',
        'payment_status' => 'pending',
        'booking_source' => 'online'
    ];

    $bookingService = new BookingService();
    $result = $bookingService->createBooking($bookingData);

    header('Content-Type: application/json');
    echo json_encode($result);
}
?>