<?php
/**
 * Booking Controller
 * Handles all HTTP requests for booking operations
 */

require_once __DIR__ . '/../models/Booking.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../../services/BookingService.php';

class BookingController {
    private $bookingModel;
    private $bookingService;

    public function __construct() {
        $this->bookingModel = new Booking();
        $this->bookingService = new BookingService();
    }

    /**
     * List all bookings with optional filters and pagination
     * GET /api/v1/bookings
     */
    public function index(Request $request) {
        $page = (int) $request->query('page', 1);
        $limit = min((int) $request->query('limit', 20), 100);
        $filters = [
            'client_id' => $request->query('client_id'),
            'car_id' => $request->query('car_id'),
            'status' => $request->query('status'),
            'date_from' => $request->query('date_from'),
            'date_to' => $request->query('date_to'),
        ];
        $filters = array_filter($filters, fn($v) => $v !== null && $v !== '');
        $result = $this->bookingModel->getAll($filters, $page, $limit);
        Response::success($result);
    }

    /**
     * Get a single booking by ID
     * GET /api/v1/bookings/{id}
     */
    public function show($id) {
        $booking = $this->bookingModel->getById($id);
        if ($booking) {
            Response::success($booking);
        } else {
            Response::error('Booking not found', 404);
        }
    }

    /**
     * Create a new booking
     * POST /api/v1/bookings
     */
    public function store(Request $request) {
        $data = $request->body();
        $result = $this->bookingService->createBooking($data);
        if ($result['success']) {
            Response::success($result, 201);
        } else {
            Response::error($result['message'], 422);
        }
    }

    /**
     * Update a booking (full update)
     * PUT /api/v1/bookings/{id}
     */
    public function update($id, Request $request) {
        $data = $request->body();
        $result = $this->bookingModel->update($id, $data);
        if ($result['success']) {
            Response::success($result);
        } else {
            Response::error($result['message'], 422);
        }
    }

    /**
     * Delete a booking (soft delete)
     * DELETE /api/v1/bookings/{id}
     */
    public function destroy($id) {
        $result = $this->bookingModel->delete($id);
        if ($result['success']) {
            Response::success($result);
        } else {
            Response::error($result['message'], 422);
        }
    }
}
