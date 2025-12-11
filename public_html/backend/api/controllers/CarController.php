<?php
/**
 * Car Controller
 * Handles all HTTP requests for car operations
 */

require_once __DIR__ . '/../models/Car.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../handlers/ImageUploadHandler.php';

class CarController {
    private $carModel;
    private $imageHandler;

    public function __construct() {
        $this->carModel = new Car();
        $this->imageHandler = new ImageUploadHandler();
    }

    /**
     * Get all cars with filters and pagination
     * GET /api/v1/cars
     */
    public function index(Request $request) {
        try {
            // Get pagination params
            $page = (int) $request->query('page', 1);
            $limit = min((int) $request->query('limit', 20), 100); // Max 100 per page

            // Get sorting params
            $sortBy = $request->query('sort_by', 'brand');
            $sortOrder = $request->query('sort_order', 'ASC');

            // Get filters
            $filters = [
                'brand' => $request->query('brand'),
                'model' => $request->query('model'),
                'fuel_type' => $request->query('fuel_type'),
                'transmission' => $request->query('transmission'),
                'status' => $request->query('status'),
                'min_price' => $request->query('min_price'),
                'max_price' => $request->query('max_price'),
                'seats' => $request->query('seats'),
                'doors' => $request->query('doors'),
                'search' => $request->query('search')
            ];

            // Remove null filters
            $filters = array_filter($filters, function($value) {
                return $value !== null && $value !== '';
            });

            $result = $this->carModel->getAll($filters, $page, $limit, $sortBy, $sortOrder);

            return Response::paginated(
                $result['data'],
                $result['total'],
                $result['page'],
                $result['limit'],
                'Cars retrieved successfully'
            );
        } catch (Exception $e) {
            error_log('Get cars error: ' . $e->getMessage());
            return Response::serverError('Failed to retrieve cars');
        }
    }

    /**
     * Get single car by ID
     * GET /api/v1/cars/{id}
     */
    public function show(Request $request) {
        try {
            $carId = $request->params('id');

            if (!$carId || !is_numeric($carId)) {
                return Response::badRequest('Invalid car ID');
            }

            $car = $this->carModel->getById($carId);

            if (!$car) {
                return Response::notFound('Car not found');
            }

            return Response::success($car, 'Car retrieved successfully');
        } catch (Exception $e) {
            error_log('Get car error: ' . $e->getMessage());
            return Response::serverError('Failed to retrieve car');
        }
    }

    /**
     * Create new car
     * POST /api/v1/cars
     */
    public function store(Request $request) {
        try {
            $data = $request->body();

            // Validate required fields
            $required = ['brand', 'model', 'year', 'registration_number', 'fuel_type', 'transmission', 'seats', 'doors', 'price_per_day'];
            $errors = [];

            foreach ($required as $field) {
                if (!isset($data[$field]) || $data[$field] === '') {
                    $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
                }
            }

            if (!empty($errors)) {
                return Response::unprocessable('Validation failed', $errors);
            }

            // Additional validation
            if (!is_numeric($data['year']) || $data['year'] < 1900 || $data['year'] > date('Y') + 1) {
                $errors['year'] = 'Invalid year';
            }

            if (!is_numeric($data['price_per_day']) || $data['price_per_day'] < 0) {
                $errors['price_per_day'] = 'Price per day must be a positive number';
            }

            if (!in_array($data['fuel_type'], ['petrol', 'diesel', 'electric', 'hybrid'])) {
                $errors['fuel_type'] = 'Invalid fuel type';
            }

            if (!in_array($data['transmission'], ['manual', 'automatic'])) {
                $errors['transmission'] = 'Invalid transmission type';
            }

            if (!empty($errors)) {
                return Response::unprocessable('Validation failed', $errors);
            }

            $carId = $this->carModel->create($data);

            if (!$carId) {
                return Response::serverError('Failed to create car');
            }

            $car = $this->carModel->getById($carId);

            return Response::created($car, 'Car created successfully');
        } catch (Exception $e) {
            error_log('Create car error: ' . $e->getMessage());
            return Response::serverError('Failed to create car');
        }
    }

    /**
     * Update car (full update)
     * PUT /api/v1/cars/{id}
     */
    public function update(Request $request) {
        try {
            $carId = $request->params('id');

            if (!$carId || !is_numeric($carId)) {
                return Response::badRequest('Invalid car ID');
            }

            $car = $this->carModel->getById($carId);
            if (!$car) {
                return Response::notFound('Car not found');
            }

            $data = $request->body();

            // Validate required fields for full update
            $required = ['brand', 'model', 'year', 'registration_number', 'fuel_type', 'transmission', 'seats', 'doors', 'price_per_day'];
            $errors = [];

            foreach ($required as $field) {
                if (!isset($data[$field]) || $data[$field] === '') {
                    $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
                }
            }

            if (!empty($errors)) {
                return Response::unprocessable('Validation failed', $errors);
            }

            $success = $this->carModel->update($carId, $data);

            if (!$success) {
                return Response::serverError('Failed to update car');
            }

            $updatedCar = $this->carModel->getById($carId);

            return Response::success($updatedCar, 'Car updated successfully');
        } catch (Exception $e) {
            error_log('Update car error: ' . $e->getMessage());
            return Response::serverError('Failed to update car');
        }
    }

    /**
     * Partially update car
     * PATCH /api/v1/cars/{id}
     */
    public function patch(Request $request) {
        try {
            $carId = $request->params('id');

            if (!$carId || !is_numeric($carId)) {
                return Response::badRequest('Invalid car ID');
            }

            $car = $this->carModel->getById($carId);
            if (!$car) {
                return Response::notFound('Car not found');
            }

            $data = $request->body();

            if (empty($data)) {
                return Response::badRequest('No data provided for update');
            }

            // Validate fields if provided
            $errors = [];

            if (isset($data['year']) && (!is_numeric($data['year']) || $data['year'] < 1900 || $data['year'] > date('Y') + 1)) {
                $errors['year'] = 'Invalid year';
            }

            if (isset($data['price_per_day']) && (!is_numeric($data['price_per_day']) || $data['price_per_day'] < 0)) {
                $errors['price_per_day'] = 'Price per day must be a positive number';
            }

            if (isset($data['fuel_type']) && !in_array($data['fuel_type'], ['petrol', 'diesel', 'electric', 'hybrid'])) {
                $errors['fuel_type'] = 'Invalid fuel type';
            }

            if (isset($data['transmission']) && !in_array($data['transmission'], ['manual', 'automatic'])) {
                $errors['transmission'] = 'Invalid transmission type';
            }

            if (isset($data['status']) && !in_array($data['status'], ['available', 'rented', 'maintenance', 'retired'])) {
                $errors['status'] = 'Invalid status';
            }

            if (!empty($errors)) {
                return Response::unprocessable('Validation failed', $errors);
            }

            $success = $this->carModel->update($carId, $data);

            if (!$success) {
                return Response::serverError('Failed to update car');
            }

            $updatedCar = $this->carModel->getById($carId);

            return Response::success($updatedCar, 'Car updated successfully');
        } catch (Exception $e) {
            error_log('Patch car error: ' . $e->getMessage());
            return Response::serverError('Failed to update car');
        }
    }

    /**
     * Delete car (soft delete)
     * DELETE /api/v1/cars/{id}
     */
    public function destroy(Request $request) {
        try {
            $carId = $request->params('id');

            if (!$carId || !is_numeric($carId)) {
                return Response::badRequest('Invalid car ID');
            }

            $car = $this->carModel->getById($carId);
            if (!$car) {
                return Response::notFound('Car not found');
            }

            $success = $this->carModel->delete($carId);

            if (!$success) {
                return Response::error('Cannot delete car with active bookings', 409);
            }

            return Response::success(null, 'Car deleted successfully');
        } catch (Exception $e) {
            error_log('Delete car error: ' . $e->getMessage());
            return Response::serverError('Failed to delete car');
        }
    }

    /**
     * Check car availability
     * GET /api/v1/cars/{id}/availability
     */
    public function checkAvailability(Request $request) {
        try {
            $carId = $request->params('id');
            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');

            if (!$carId || !is_numeric($carId)) {
                return Response::badRequest('Invalid car ID');
            }

            if (!$startDate || !$endDate) {
                return Response::badRequest('Start date and end date are required');
            }

            $car = $this->carModel->getById($carId);
            if (!$car) {
                return Response::notFound('Car not found');
            }

            $isAvailable = $this->carModel->isAvailable($carId, $startDate, $endDate);

            return Response::success([
                'car_id' => $carId,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'available' => $isAvailable
            ], $isAvailable ? 'Car is available' : 'Car is not available for selected dates');
        } catch (Exception $e) {
            error_log('Check availability error: ' . $e->getMessage());
            return Response::serverError('Failed to check availability');
        }
    }

    /**
     * Get car images
     * GET /api/v1/cars/{id}/images
     */
    public function getImages(Request $request) {
        try {
            $carId = $request->params('id');

            if (!$carId || !is_numeric($carId)) {
                return Response::badRequest('Invalid car ID');
            }

            $car = $this->carModel->getById($carId);
            if (!$car) {
                return Response::notFound('Car not found');
            }

            $images = $this->carModel->getCarImages($carId);

            return Response::success($images, 'Images retrieved successfully');
        } catch (Exception $e) {
            error_log('Get images error: ' . $e->getMessage());
            return Response::serverError('Failed to retrieve images');
        }
    }

    /**
     * Upload car image
     * POST /api/v1/cars/{id}/images
     */
    public function uploadImage(Request $request) {
        try {
            $carId = $request->params('id');

            if (!$carId || !is_numeric($carId)) {
                return Response::badRequest('Invalid car ID');
            }

            $car = $this->carModel->getById($carId);
            if (!$car) {
                return Response::notFound('Car not found');
            }

            if (!$request->hasFile('image')) {
                return Response::badRequest('No image file provided');
            }

            // Upload image using ImageUploadHandler
            $file = $request->file('image');
            $uploadResult = $this->imageHandler->upload($file, 'cars', true);

            if (!$uploadResult) {
                $errors = $this->imageHandler->getErrors();
                return Response::unprocessable('Image upload failed', ['image' => $errors]);
            }

            // Get additional params
            $isPrimary = $request->body('is_primary', false);
            $displayOrder = $request->body('display_order', 0);

            // Add image to database
            $imageId = $this->carModel->addImage($carId, $uploadResult['url'], $isPrimary, $displayOrder);

            if (!$imageId) {
                // If database insert fails, delete uploaded file
                $this->imageHandler->deleteImage($uploadResult['url']);
                return Response::serverError('Failed to save image to database');
            }

            // Return uploaded image info with thumbnails
            $uploadResult['image_id'] = $imageId;
            $uploadResult['car_id'] = $carId;

            return Response::created($uploadResult, 'Image uploaded successfully');
        } catch (Exception $e) {
            error_log('Upload image error: ' . $e->getMessage());
            return Response::serverError('Failed to upload image');
        }
    }

    /**
     * Delete car image
     * DELETE /api/v1/cars/{id}/images/{imageId}
     */
    public function deleteImage(Request $request) {
        try {
            $carId = $request->params('id');
            $imageId = $request->params('imageId');

            if (!$carId || !is_numeric($carId) || !$imageId || !is_numeric($imageId)) {
                return Response::badRequest('Invalid car ID or image ID');
            }

            // Get image info before deleting
            $images = $this->carModel->getCarImages($carId);
            $imageToDelete = null;

            foreach ($images as $img) {
                if ($img['image_id'] == $imageId) {
                    $imageToDelete = $img;
                    break;
                }
            }

            if (!$imageToDelete) {
                return Response::notFound('Image not found');
            }

            // Delete from database
            $success = $this->carModel->deleteImage($imageId);

            if (!$success) {
                return Response::serverError('Failed to delete image from database');
            }

            // Delete physical file and thumbnails
            $this->imageHandler->deleteImage($imageToDelete['image_url']);

            return Response::success(null, 'Image deleted successfully');
        } catch (Exception $e) {
            error_log('Delete image error: ' . $e->getMessage());
            return Response::serverError('Failed to delete image');
        }
    }

    /**
     * Set primary image
     * PATCH /api/v1/cars/{id}/images/{imageId}/primary
     */
    public function setPrimaryImage(Request $request) {
        try {
            $carId = $request->params('id');
            $imageId = $request->params('imageId');

            if (!$carId || !is_numeric($carId) || !$imageId || !is_numeric($imageId)) {
                return Response::badRequest('Invalid car ID or image ID');
            }

            $success = $this->carModel->setPrimaryImage($carId, $imageId);

            if (!$success) {
                return Response::serverError('Failed to set primary image');
            }

            $images = $this->carModel->getCarImages($carId);

            return Response::success($images, 'Primary image set successfully');
        } catch (Exception $e) {
            error_log('Set primary image error: ' . $e->getMessage());
            return Response::serverError('Failed to set primary image');
        }
    }

    /**
     * Get available brands
     * GET /api/v1/cars/brands
     */
    public function getBrands(Request $request) {
        try {
            $brands = $this->carModel->getBrands();
            return Response::success($brands, 'Brands retrieved successfully');
        } catch (Exception $e) {
            error_log('Get brands error: ' . $e->getMessage());
            return Response::serverError('Failed to retrieve brands');
        }
    }

    /**
     * Get car statistics
     * GET /api/v1/cars/stats
     */
    public function getStats(Request $request) {
        try {
            $stats = $this->carModel->getStats();
            return Response::success($stats, 'Statistics retrieved successfully');
        } catch (Exception $e) {
            error_log('Get stats error: ' . $e->getMessage());
            return Response::serverError('Failed to retrieve statistics');
        }
    }
}
?>
