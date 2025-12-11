<?php
/**
 * API Configuration
 * Loads API configuration from .env file
 */

// Load environment variables
require_once __DIR__ . '/DotEnv.php';
DotEnv::load(__DIR__ . '/../.env');

// API Version
define('API_VERSION', DotEnv::get('API_VERSION', '1.0.0'));
define('API_BASE_PATH', '/api/v1');

// Environment
define('API_ENV', DotEnv::get('APP_ENV', 'development')); // development, production
define('API_DEBUG', DotEnv::get('APP_DEBUG', 'true') === 'true');

// JWT Configuration (from .env)
define('JWT_SECRET', DotEnv::get('JWT_SECRET', 'change-this-secret-key'));
define('JWT_ALGORITHM', DotEnv::get('JWT_ALGORITHM', 'HS256'));
define('JWT_EXPIRATION', (int) DotEnv::get('JWT_EXPIRATION', 86400)); // 24 hours
define('JWT_REFRESH_EXPIRATION', (int) DotEnv::get('JWT_REFRESH_EXPIRATION', 604800)); // 7 days

// Upload Configuration (from .env)
define('UPLOAD_MAX_SIZE', (int) DotEnv::get('UPLOAD_MAX_SIZE', 5242880)); // 5MB
$allowedTypes = explode(',', DotEnv::get('UPLOAD_ALLOWED_TYPES', 'jpg,jpeg,png,webp'));
define('UPLOAD_ALLOWED_TYPES', $allowedTypes);
define('UPLOAD_PATH', __DIR__ . '/..' . DotEnv::get('UPLOAD_PATH', '/uploads/'));
define('UPLOAD_URL', DotEnv::get('UPLOAD_PATH', '/uploads/'));

// Thumbnail sizes
define('THUMBNAIL_SMALL', [200, 150]);
define('THUMBNAIL_MEDIUM', [400, 300]);
define('THUMBNAIL_LARGE', [800, 600]);

// Rate Limiting (from .env)
define('RATE_LIMIT_PUBLIC', (int) DotEnv::get('RATE_LIMIT_PUBLIC', 60));
define('RATE_LIMIT_AUTHENTICATED', (int) DotEnv::get('RATE_LIMIT_AUTHENTICATED', 300));
define('RATE_LIMIT_UPLOAD', (int) DotEnv::get('RATE_LIMIT_UPLOAD', 10));

// CORS Configuration (from .env)
$corsOrigins = explode(',', DotEnv::get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000'));
define('CORS_ALLOWED_ORIGINS', $corsOrigins);
define('CORS_ALLOWED_METHODS', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);
define('CORS_ALLOWED_HEADERS', ['Content-Type', 'Authorization', 'X-Requested-With']);
define('CORS_MAX_AGE', (int) DotEnv::get('CORS_MAX_AGE', 3600));

// Pagination (from .env)
define('PAGINATION_DEFAULT_LIMIT', (int) DotEnv::get('PAGINATION_DEFAULT_LIMIT', 20));
define('PAGINATION_MAX_LIMIT', (int) DotEnv::get('PAGINATION_MAX_LIMIT', 100));

// Logging
define('LOG_PATH', __DIR__ . '/../logs/api/');
define('LOG_ENABLED', true);
define('LOG_LEVEL', API_DEBUG ? 'debug' : 'error'); // debug, info, warning, error

// Error Messages
define('ERROR_MESSAGES', [
    'unauthorized' => 'Authentication required. Please provide a valid access token.',
    'forbidden' => 'You do not have permission to access this resource.',
    'not_found' => 'The requested resource was not found.',
    'validation' => 'Validation failed. Please check your input.',
    'server_error' => 'An internal server error occurred. Please try again later.',
    'rate_limit' => 'Rate limit exceeded. Please try again later.'
]);

// API Configuration Class
class ApiConfig {
    
    /**
     * Get upload configuration
     */
    public static function getUploadConfig() {
        return [
            'max_size' => UPLOAD_MAX_SIZE,
            'allowed_types' => UPLOAD_ALLOWED_TYPES,
            'path' => UPLOAD_PATH,
            'url' => UPLOAD_URL,
            'thumbnails' => [
                'small' => THUMBNAIL_SMALL,
                'medium' => THUMBNAIL_MEDIUM,
                'large' => THUMBNAIL_LARGE
            ]
        ];
    }
    
    /**
     * Get CORS configuration
     */
    public static function getCorsConfig() {
        return [
            'origins' => CORS_ALLOWED_ORIGINS,
            'methods' => CORS_ALLOWED_METHODS,
            'headers' => CORS_ALLOWED_HEADERS,
            'max_age' => CORS_MAX_AGE
        ];
    }
    
    /**
     * Get rate limit configuration
     */
    public static function getRateLimitConfig() {
        return [
            'public' => RATE_LIMIT_PUBLIC,
            'authenticated' => RATE_LIMIT_AUTHENTICATED,
            'upload' => RATE_LIMIT_UPLOAD
        ];
    }
    
    /**
     * Get JWT configuration
     */
    public static function getJwtConfig() {
        return [
            'secret' => JWT_SECRET,
            'algorithm' => JWT_ALGORITHM,
            'expiration' => JWT_EXPIRATION,
            'refresh_expiration' => JWT_REFRESH_EXPIRATION
        ];
    }
    
    /**
     * Check if debug mode is enabled
     */
    public static function isDebug() {
        return API_DEBUG;
    }
    
    /**
     * Get error message
     */
    public static function getErrorMessage($key) {
        return ERROR_MESSAGES[$key] ?? 'An error occurred';
    }
}
?>
