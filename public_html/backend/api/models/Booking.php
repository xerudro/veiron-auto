<?php
/**
 * Booking Model
 * Handles all database operations for bookings
 */

require_once __DIR__ . '/../../database/config.php';

class Booking {
    private $pdo;

    public function __construct() {
        $this->pdo = getDBConnection();
    }

    /**
     * Get all bookings with optional filters and pagination
     */
    public function getAll($filters = [], $page = 1, $limit = 20) {
        $offset = ($page - 1) * $limit;
        $params = [];
        $sql = "SELECT * FROM bookings WHERE 1=1";
        if (!empty($filters['client_id'])) {
            $sql .= " AND client_id = :client_id";
            $params[':client_id'] = $filters['client_id'];
        }
        if (!empty($filters['car_id'])) {
            $sql .= " AND car_id = :car_id";
            $params[':car_id'] = $filters['car_id'];
        }
        if (!empty($filters['status'])) {
            $sql .= " AND status = :status";
            $params[':status'] = $filters['status'];
        }
        if (!empty($filters['date_from'])) {
            $sql .= " AND pickup_date >= :date_from";
            $params[':date_from'] = $filters['date_from'];
        }
        if (!empty($filters['date_to'])) {
            $sql .= " AND dropoff_date <= :date_to";
            $params[':date_to'] = $filters['date_to'];
        }
        $sql .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        $params[':limit'] = (int)$limit;
        $params[':offset'] = (int)$offset;
        $stmt = $this->pdo->prepare($sql);
        foreach ($params as $k => $v) {
            $type = is_int($v) ? PDO::PARAM_INT : PDO::PARAM_STR;
            $stmt->bindValue($k, $v, $type);
        }
        $stmt->execute();
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return [
            'data' => $bookings,
            'page' => $page,
            'limit' => $limit
        ];
    }

    /**
     * Get a single booking by ID
     */
    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM bookings WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Update a booking (full update)
     */
    public function update($id, $data) {
        $fields = [];
        $params = [];
        foreach ($data as $k => $v) {
            $fields[] = "$k = :$k";
            $params[":$k"] = $v;
        }
        $params[':id'] = $id;
        $sql = "UPDATE bookings SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $success = $stmt->execute($params);
        return [
            'success' => $success,
            'message' => $success ? 'Booking updated' : 'Update failed'
        ];
    }

    /**
     * Soft delete a booking
     */
    public function delete($id) {
        $stmt = $this->pdo->prepare("UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE id = ?");
        $success = $stmt->execute([$id]);
        return [
            'success' => $success,
            'message' => $success ? 'Booking cancelled' : 'Delete failed'
        ];
    }
}
