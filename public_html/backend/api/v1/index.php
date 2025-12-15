<?php
/**
 * VEIRONAUTO REST API v1
 * Main API Entry Point
 */

// Load configuration first
require_once __DIR__ . '/../../config/api.php';

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', API_DEBUG);

// Set timezone
date_default_timezone_set('Europe/Bucharest');

// Load core classes
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/Router.php';
require_once __DIR__ . '/../core/Auth.php';

// Load controllers
require_once __DIR__ . '/../controllers/CarController.php';
require_once __DIR__ . '/../controllers/BookingController.php';

// CORS Headers
header('Access-Control-Allow-Origin: *'); // In production, use specific origin
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Initialize request and router
$request = new Request();
$router = new Router($request);

// Initialize controllers
$carController = new CarController();
$bookingController = new BookingController();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Bookings CRUD
$router->get('/v1/bookings', function($req) use ($bookingController) {
    $bookingController->index($req);
});
$router->get('/v1/bookings/{id}', function($req, $id) use ($bookingController) {
    $bookingController->show($id);
});
$router->post('/v1/bookings', function($req) use ($bookingController) {
    $bookingController->store($req);
});
$router->put('/v1/bookings/{id}', function($req, $id) use ($bookingController) {
    $bookingController->update($id, $req);
});
$router->delete('/v1/bookings/{id}', function($req, $id) use ($bookingController) {
    $bookingController->destroy($id);
});

// Health check
$router->get('/v1/health', function($req) {
    Response::success([
        'status' => 'healthy',
        'version' => API_VERSION,
        'timestamp' => date('c')
    ], 'API is running');
});

// Authentication routes
$router->post('/v1/auth/login', function($req) {
    $email = $req->body('email');
    $password = $req->body('password');
    
    if (empty($email) || empty($password)) {
        Response::badRequest('Email and password are required');
    }
    
    $user = Auth::authenticate($email, $password);
    
    if (!$user) {
        Response::unauthorized('Invalid credentials');
    }
    
    $token = Auth::generateToken($user);
    
    Response::success([
        'token' => $token,
        'user' => $user
    ], 'Login successful');
});

$router->post('/v1/auth/logout', function($req) {
    $token = Auth::extractToken($req);
    
    if (!$token) {
        Response::badRequest('Token not provided');
    }
    
    $payload = Auth::validateToken($token);
    
    if (!$payload) {
        Response::badRequest('Invalid token');
    }
    
    Auth::blacklistToken($token, $payload['exp']);
    
    Response::success(null, 'Logout successful');
});

// Test endpoint
$router->get('/v1/test', function($req) {
    Response::success([
        'message' => 'API is working!',
        'method' => $req->method(),
        'uri' => $req->uri(),
        'query' => $req->query(),
        'headers' => $req->headers()
    ]);
});

// ============================================
// PROTECTED ROUTES (Require authentication)
// ============================================

// ============================================
// CARS ENDPOINTS
// ============================================

// Get all cars (public - for browsing)
$router->get('/v1/cars', function($req) use ($carController) {
    return $carController->index($req);
});

// Get car brands (public)
$router->get('/v1/cars/brands', function($req) use ($carController) {
    return $carController->getBrands($req);
});

// Get car statistics (admin only)
$router->get('/v1/cars/stats', function($req) use ($carController) {
    $user = Auth::user($req);
    if (!$user || !Auth::hasRole($user, 'admin')) {
        Response::forbidden('Admin access required');
    }
    return $carController->getStats($req);
});

// Get single car (public)
$router->get('/v1/cars/{id}', function($req) use ($carController) {
    return $carController->show($req);
});

// Check car availability (public)
$router->get('/v1/cars/{id}/availability', function($req) use ($carController) {
    return $carController->checkAvailability($req);
});

// Get car images (public)
$router->get('/v1/cars/{id}/images', function($req) use ($carController) {
    return $carController->getImages($req);
});

// Create new car (admin only)
$router->post('/v1/cars', function($req) use ($carController) {
    $user = Auth::user($req);
    if (!$user || !Auth::hasRole($user, 'admin')) {
        Response::forbidden('Admin access required');
    }
    return $carController->store($req);
});

// Upload car image (admin/manager only)
$router->post('/v1/cars/{id}/images', function($req) use ($carController) {
    $user = Auth::user($req);
    if (!$user || !Auth::hasRole($user, 'manager')) {
        Response::forbidden('Manager access required');
    }
    return $carController->uploadImage($req);
});

// Update car - full update (admin only)
$router->put('/v1/cars/{id}', function($req) use ($carController) {
    $user = Auth::user($req);
    if (!$user || !Auth::hasRole($user, 'admin')) {
        Response::forbidden('Admin access required');
    }
    return $carController->update($req);
});

// Update car - partial update (admin/manager only)
$router->patch('/v1/cars/{id}', function($req) use ($carController) {
    $user = Auth::user($req);
    if (!$user || !Auth::hasRole($user, 'manager')) {
        Response::forbidden('Manager access required');
    }
    return $carController->patch($req);
});

// Set primary image (admin/manager only)
$router->patch('/v1/cars/{id}/images/{imageId}/primary', function($req) use ($carController) {
    $user = Auth::user($req);
    if (!$user || !Auth::hasRole($user, 'manager')) {
        Response::forbidden('Manager access required');
    }
    return $carController->setPrimaryImage($req);
});

// Delete car (admin only - soft delete)
$router->delete('/v1/cars/{id}', function($req) use ($carController) {
    $user = Auth::user($req);
    if (!$user || !Auth::hasRole($user, 'admin')) {
        Response::forbidden('Admin access required');
    }
    return $carController->destroy($req);
});

// Delete car image (admin/manager only)
$router->delete('/v1/cars/{id}/images/{imageId}', function($req) use ($carController) {
    $user = Auth::user($req);
    if (!$user || !Auth::hasRole($user, 'manager')) {
        Response::forbidden('Manager access required');
    }
    return $carController->deleteImage($req);
});

// Bookings endpoints (will be implemented in Phase 3)
$router->get('/v1/bookings', function($req) {
    Response::success([], 'Bookings endpoint - Coming soon', ['auth']);
});

$router->post('/v1/bookings', function($req) {
    Response::success([], 'Create booking endpoint - Coming soon');
});

// Admin only endpoint example
$router->get('/v1/admin/stats', function($req) {
    // Check authentication
    $user = Auth::user($req);
    
    if (!$user) {
        Response::unauthorized();
    }
    
    if (!Auth::hasRole($user, 'admin')) {
        Response::forbidden('Admin access required');
    }
    
    Response::success([
        'stats' => 'Admin statistics here',
        'user' => $user
    ]);
});

// ============================================
// ERROR HANDLERS
// ============================================

// Set custom error handler
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    if (API_DEBUG) {
        Response::serverError("Error: $errstr in $errfile on line $errline");
    } else {
        Response::serverError('An internal error occurred');
    }
});

// Set custom exception handler
set_exception_handler(function($exception) {
    if (API_DEBUG) {
        Response::serverError($exception->getMessage() . ' in ' . $exception->getFile() . ':' . $exception->getLine());
    } else {
        Response::serverError('An internal error occurred');
    }
});

// ============================================
// DISPATCH REQUEST
// ============================================

try {
    $router->dispatch();
} catch (Exception $e) {
    if (API_DEBUG) {
        Response::serverError($e->getMessage());
    } else {
        Response::serverError('An error occurred while processing your request');
    }
}
?>
