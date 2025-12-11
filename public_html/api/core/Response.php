<?php
/**
 * Response Class - Standardized JSON API Responses
 * Handles all HTTP responses with consistent format
 */

class Response {
    
    private static $version = '1.0.0';
    
    /**
     * Send JSON response
     */
    private static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
    
    /**
     * Success response
     */
    public static function success($data = null, $message = 'Operation successful', $meta = []) {
        self::json([
            'success' => true,
            'data' => $data,
            'message' => $message,
            'meta' => array_merge([
                'timestamp' => date('c'),
                'version' => self::$version
            ], $meta)
        ], 200);
    }
    
    /**
     * Created response (201)
     */
    public static function created($data = null, $message = 'Resource created successfully') {
        self::json([
            'success' => true,
            'data' => $data,
            'message' => $message,
            'meta' => [
                'timestamp' => date('c'),
                'version' => self::$version
            ]
        ], 201);
    }
    
    /**
     * No content response (204)
     */
    public static function noContent() {
        http_response_code(204);
        exit;
    }
    
    /**
     * Error response
     */
    public static function error($message, $statusCode = 400, $errors = []) {
        self::json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'meta' => [
                'timestamp' => date('c'),
                'version' => self::$version
            ]
        ], $statusCode);
    }
    
    /**
     * Bad Request (400)
     */
    public static function badRequest($message = 'Bad request', $errors = []) {
        self::error($message, 400, $errors);
    }
    
    /**
     * Unauthorized (401)
     */
    public static function unauthorized($message = 'Authentication required') {
        self::error($message, 401);
    }
    
    /**
     * Forbidden (403)
     */
    public static function forbidden($message = 'Access forbidden') {
        self::error($message, 403);
    }
    
    /**
     * Not Found (404)
     */
    public static function notFound($message = 'Resource not found') {
        self::error($message, 404);
    }
    
    /**
     * Unprocessable Entity (422)
     */
    public static function unprocessable($message = 'Validation failed', $errors = []) {
        self::error($message, 422, $errors);
    }
    
    /**
     * Too Many Requests (429)
     */
    public static function tooManyRequests($message = 'Rate limit exceeded') {
        self::error($message, 429);
    }
    
    /**
     * Internal Server Error (500)
     */
    public static function serverError($message = 'Internal server error') {
        self::error($message, 500);
    }
    
    /**
     * Paginated response
     */
    public static function paginated($data, $total, $page, $limit, $message = 'Data retrieved successfully') {
        self::json([
            'success' => true,
            'data' => $data,
            'message' => $message,
            'meta' => [
                'pagination' => [
                    'total' => $total,
                    'page' => $page,
                    'limit' => $limit,
                    'pages' => ceil($total / $limit)
                ],
                'timestamp' => date('c'),
                'version' => self::$version
            ]
        ], 200);
    }
}
?>
