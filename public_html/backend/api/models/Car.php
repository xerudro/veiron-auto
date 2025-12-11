<?php
/**
 * Car Model
 * Handles all database operations for cars
 */

require_once __DIR__ . '/../../database/config.php';

class Car {
    private $pdo;

    public function __construct() {
        $this->pdo = getDBConnection();
    }

    /**
     * Get all cars with optional filters
     * @param array $filters - brand, fuel_type, transmission, status, min_price, max_price, seats, etc.
     * @param int $page - Page number for pagination
     * @param int $limit - Items per page
     * @param string $sortBy - Column to sort by
     * @param string $sortOrder - ASC or DESC
     * @return array
     */
    public function getAll($filters = [], $page = 1, $limit = 20, $sortBy = 'brand', $sortOrder = 'ASC') {
        $offset = ($page - 1) * $limit;
        $params = [];

        // Base query
        $sql = "SELECT
                    c.*,
                    (SELECT COUNT(*) FROM bookings b WHERE b.car_id = c.car_id AND b.status = 'active') as active_bookings,
                    (SELECT GROUP_CONCAT(image_url ORDER BY is_primary DESC, display_order ASC)
                     FROM car_images ci WHERE ci.car_id = c.car_id) as images
                FROM cars c
                WHERE 1=1";

        // Apply filters
        if (!empty($filters['brand'])) {
            $sql .= " AND c.brand = :brand";
            $params[':brand'] = $filters['brand'];
        }

        if (!empty($filters['model'])) {
            $sql .= " AND c.model LIKE :model";
            $params[':model'] = '%' . $filters['model'] . '%';
        }

        if (!empty($filters['fuel_type'])) {
            $sql .= " AND c.fuel_type = :fuel_type";
            $params[':fuel_type'] = $filters['fuel_type'];
        }

        if (!empty($filters['transmission'])) {
            $sql .= " AND c.transmission = :transmission";
            $params[':transmission'] = $filters['transmission'];
        }

        if (!empty($filters['status'])) {
            $sql .= " AND c.status = :status";
            $params[':status'] = $filters['status'];
        }

        if (isset($filters['min_price'])) {
            $sql .= " AND c.price_per_day >= :min_price";
            $params[':min_price'] = $filters['min_price'];
        }

        if (isset($filters['max_price'])) {
            $sql .= " AND c.price_per_day <= :max_price";
            $params[':max_price'] = $filters['max_price'];
        }

        if (isset($filters['seats'])) {
            $sql .= " AND c.seats >= :seats";
            $params[':seats'] = $filters['seats'];
        }

        if (isset($filters['doors'])) {
            $sql .= " AND c.doors = :doors";
            $params[':doors'] = $filters['doors'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (c.brand LIKE :search OR c.model LIKE :search OR c.registration_number LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        // Get total count before pagination
        $countSql = "SELECT COUNT(*) as total FROM (" . $sql . ") as filtered_cars";
        $countStmt = $this->pdo->prepare($countSql);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];

        // Apply sorting
        $allowedSortColumns = ['brand', 'model', 'year', 'price_per_day', 'created_at', 'seats', 'doors'];
        $sortBy = in_array($sortBy, $allowedSortColumns) ? $sortBy : 'brand';
        $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';

        $sql .= " ORDER BY c.{$sortBy} {$sortOrder}";

        // Apply pagination
        $sql .= " LIMIT :limit OFFSET :offset";

        $stmt = $this->pdo->prepare($sql);

        // Bind all params
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

        $stmt->execute();
        $cars = $stmt->fetchAll();

        // Process images for each car
        foreach ($cars as &$car) {
            $car['images'] = $car['images'] ? explode(',', $car['images']) : [];
        }

        return [
            'data' => $cars,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'pages' => ceil($total / $limit)
        ];
    }

    /**
     * Get car by ID
     * @param int $carId
     * @return array|null
     */
    public function getById($carId) {
        $sql = "SELECT
                    c.*,
                    (SELECT COUNT(*) FROM bookings b WHERE b.car_id = c.car_id AND b.status = 'active') as active_bookings
                FROM cars c
                WHERE c.car_id = :car_id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':car_id' => $carId]);
        $car = $stmt->fetch();

        if (!$car) {
            return null;
        }

        // Get images
        $car['images'] = $this->getCarImages($carId);

        // Get recent bookings
        $car['recent_bookings'] = $this->getRecentBookings($carId, 5);

        return $car;
    }

    /**
     * Create new car
     * @param array $data
     * @return int|false - Returns car_id on success, false on failure
     */
    public function create($data) {
        $sql = "INSERT INTO cars (
                    brand, model, year, color, registration_number,
                    fuel_type, transmission, seats, doors,
                    price_per_day, deposit_amount, status,
                    mileage, last_service_date, next_service_date,
                    insurance_expiry, road_tax_expiry, mot_expiry,
                    features, description
                ) VALUES (
                    :brand, :model, :year, :color, :registration_number,
                    :fuel_type, :transmission, :seats, :doors,
                    :price_per_day, :deposit_amount, :status,
                    :mileage, :last_service_date, :next_service_date,
                    :insurance_expiry, :road_tax_expiry, :mot_expiry,
                    :features, :description
                )";

        try {
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                ':brand' => $data['brand'],
                ':model' => $data['model'],
                ':year' => $data['year'],
                ':color' => $data['color'],
                ':registration_number' => $data['registration_number'],
                ':fuel_type' => $data['fuel_type'],
                ':transmission' => $data['transmission'],
                ':seats' => $data['seats'],
                ':doors' => $data['doors'],
                ':price_per_day' => $data['price_per_day'],
                ':deposit_amount' => $data['deposit_amount'] ?? 0,
                ':status' => $data['status'] ?? 'available',
                ':mileage' => $data['mileage'] ?? 0,
                ':last_service_date' => $data['last_service_date'] ?? null,
                ':next_service_date' => $data['next_service_date'] ?? null,
                ':insurance_expiry' => $data['insurance_expiry'] ?? null,
                ':road_tax_expiry' => $data['road_tax_expiry'] ?? null,
                ':mot_expiry' => $data['mot_expiry'] ?? null,
                ':features' => isset($data['features']) ? json_encode($data['features']) : null,
                ':description' => $data['description'] ?? null
            ]);

            return $result ? $this->pdo->lastInsertId() : false;
        } catch (PDOException $e) {
            error_log('Car creation failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update car
     * @param int $carId
     * @param array $data
     * @return bool
     */
    public function update($carId, $data) {
        // Build dynamic update query
        $fields = [];
        $params = [':car_id' => $carId];

        $allowedFields = [
            'brand', 'model', 'year', 'color', 'registration_number',
            'fuel_type', 'transmission', 'seats', 'doors',
            'price_per_day', 'deposit_amount', 'status',
            'mileage', 'last_service_date', 'next_service_date',
            'insurance_expiry', 'road_tax_expiry', 'mot_expiry',
            'features', 'description'
        ];

        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $field === 'features' && is_array($data[$field])
                    ? json_encode($data[$field])
                    : $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE cars SET " . implode(', ', $fields) . " WHERE car_id = :car_id";

        try {
            $stmt = $this->pdo->prepare($sql);
            return $stmt->execute($params);
        } catch (PDOException $e) {
            error_log('Car update failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete car (soft delete by setting status to 'retired')
     * @param int $carId
     * @return bool
     */
    public function delete($carId) {
        // Check if car has active bookings
        $sql = "SELECT COUNT(*) as count FROM bookings
                WHERE car_id = :car_id AND status = 'active'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':car_id' => $carId]);
        $result = $stmt->fetch();

        if ($result['count'] > 0) {
            return false; // Cannot delete car with active bookings
        }

        // Soft delete
        $sql = "UPDATE cars SET status = 'retired' WHERE car_id = :car_id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':car_id' => $carId]);
    }

    /**
     * Hard delete car (use with caution!)
     * @param int $carId
     * @return bool
     */
    public function hardDelete($carId) {
        try {
            $this->pdo->beginTransaction();

            // Delete images first
            $sql = "DELETE FROM car_images WHERE car_id = :car_id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([':car_id' => $carId]);

            // Delete car
            $sql = "DELETE FROM cars WHERE car_id = :car_id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([':car_id' => $carId]);

            $this->pdo->commit();
            return true;
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            error_log('Car hard delete failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Check car availability for date range
     * @param int $carId
     * @param string $startDate
     * @param string $endDate
     * @return bool
     */
    public function isAvailable($carId, $startDate, $endDate) {
        $sql = "SELECT COUNT(*) as count FROM bookings
                WHERE car_id = :car_id
                AND status IN ('pending', 'confirmed', 'active')
                AND (
                    (pickup_date BETWEEN :start_date AND :end_date)
                    OR (return_date BETWEEN :start_date AND :end_date)
                    OR (:start_date BETWEEN pickup_date AND return_date)
                )";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':car_id' => $carId,
            ':start_date' => $startDate,
            ':end_date' => $endDate
        ]);

        $result = $stmt->fetch();
        return $result['count'] == 0;
    }

    /**
     * Get car images
     * @param int $carId
     * @return array
     */
    public function getCarImages($carId) {
        $sql = "SELECT * FROM car_images
                WHERE car_id = :car_id
                ORDER BY is_primary DESC, display_order ASC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':car_id' => $carId]);
        return $stmt->fetchAll();
    }

    /**
     * Add car image
     * @param int $carId
     * @param string $imageUrl
     * @param bool $isPrimary
     * @param int $displayOrder
     * @return int|false
     */
    public function addImage($carId, $imageUrl, $isPrimary = false, $displayOrder = 0) {
        // If setting as primary, unset other primary images
        if ($isPrimary) {
            $sql = "UPDATE car_images SET is_primary = 0 WHERE car_id = :car_id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([':car_id' => $carId]);
        }

        $sql = "INSERT INTO car_images (car_id, image_url, is_primary, display_order)
                VALUES (:car_id, :image_url, :is_primary, :display_order)";

        try {
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute([
                ':car_id' => $carId,
                ':image_url' => $imageUrl,
                ':is_primary' => $isPrimary ? 1 : 0,
                ':display_order' => $displayOrder
            ]);

            return $result ? $this->pdo->lastInsertId() : false;
        } catch (PDOException $e) {
            error_log('Image add failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete car image
     * @param int $imageId
     * @return bool
     */
    public function deleteImage($imageId) {
        $sql = "DELETE FROM car_images WHERE image_id = :image_id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':image_id' => $imageId]);
    }

    /**
     * Set primary image
     * @param int $carId
     * @param int $imageId
     * @return bool
     */
    public function setPrimaryImage($carId, $imageId) {
        try {
            $this->pdo->beginTransaction();

            // Unset all primary images for this car
            $sql = "UPDATE car_images SET is_primary = 0 WHERE car_id = :car_id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([':car_id' => $carId]);

            // Set new primary image
            $sql = "UPDATE car_images SET is_primary = 1 WHERE image_id = :image_id AND car_id = :car_id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([':image_id' => $imageId, ':car_id' => $carId]);

            $this->pdo->commit();
            return true;
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            error_log('Set primary image failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get recent bookings for a car
     * @param int $carId
     * @param int $limit
     * @return array
     */
    private function getRecentBookings($carId, $limit = 5) {
        $sql = "SELECT b.*, c.first_name, c.last_name, c.email
                FROM bookings b
                LEFT JOIN clients c ON b.client_id = c.client_id
                WHERE b.car_id = :car_id
                ORDER BY b.created_at DESC
                LIMIT :limit";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':car_id', $carId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Get unique brands
     * @return array
     */
    public function getBrands() {
        $sql = "SELECT DISTINCT brand FROM cars WHERE status != 'retired' ORDER BY brand ASC";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    /**
     * Get car statistics
     * @return array
     */
    public function getStats() {
        $sql = "SELECT
                    COUNT(*) as total_cars,
                    SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_cars,
                    SUM(CASE WHEN status = 'rented' THEN 1 ELSE 0 END) as rented_cars,
                    SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance_cars,
                    AVG(price_per_day) as avg_price_per_day,
                    MAX(price_per_day) as max_price_per_day,
                    MIN(price_per_day) as min_price_per_day
                FROM cars
                WHERE status != 'retired'";

        $stmt = $this->pdo->query($sql);
        return $stmt->fetch();
    }
}
?>
