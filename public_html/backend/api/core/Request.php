<?php
/**
 * Request Class - HTTP Request Handler
 * Parses and validates incoming HTTP requests
 */

class Request {
    
    private $method;
    private $uri;
    private $params;
    private $query;
    private $body;
    private $headers;
    private $files;
    
    public function __construct() {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->uri = $this->parseUri();
        $this->params = [];
        $this->query = $_GET;
        $this->body = $this->parseBody();
        $this->headers = $this->parseHeaders();
        $this->files = $_FILES;
    }
    
    /**
     * Parse request URI
     */
    private function parseUri() {
        $uri = $_SERVER['REQUEST_URI'];
        
        // Remove query string
        if (($pos = strpos($uri, '?')) !== false) {
            $uri = substr($uri, 0, $pos);
        }
        
        // Remove /api prefix if present
        $uri = preg_replace('#^/api#', '', $uri);
        
        return rtrim($uri, '/') ?: '/';
    }
    
    /**
     * Parse request body
     */
    private function parseBody() {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        
        if (strpos($contentType, 'application/json') !== false) {
            $input = file_get_contents('php://input');
            return json_decode($input, true) ?? [];
        }
        
        if ($this->method === 'POST' || $this->method === 'PUT' || $this->method === 'PATCH') {
            return $_POST;
        }
        
        return [];
    }
    
    /**
     * Parse request headers
     */
    private function parseHeaders() {
        $headers = [];
        
        foreach ($_SERVER as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $header = str_replace('_', '-', substr($key, 5));
                $headers[$header] = $value;
            }
        }
        
        // Add Content-Type and Authorization if present
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers['CONTENT-TYPE'] = $_SERVER['CONTENT_TYPE'];
        }
        
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers['AUTHORIZATION'] = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $headers['AUTHORIZATION'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
        
        return $headers;
    }
    
    /**
     * Get request method
     */
    public function method() {
        return $this->method;
    }
    
    /**
     * Get request URI
     */
    public function uri() {
        return $this->uri;
    }
    
    /**
     * Get route parameters
     */
    public function params($key = null) {
        if ($key === null) {
            return $this->params;
        }
        return $this->params[$key] ?? null;
    }
    
    /**
     * Set route parameters
     */
    public function setParams($params) {
        $this->params = $params;
    }
    
    /**
     * Get query parameters
     */
    public function query($key = null, $default = null) {
        if ($key === null) {
            return $this->query;
        }
        return $this->query[$key] ?? $default;
    }
    
    /**
     * Get request body
     */
    public function body($key = null, $default = null) {
        if ($key === null) {
            return $this->body;
        }
        return $this->body[$key] ?? $default;
    }
    
    /**
     * Get request input (body + query combined)
     */
    public function input($key = null, $default = null) {
        $input = array_merge($this->query, $this->body);
        
        if ($key === null) {
            return $input;
        }
        return $input[$key] ?? $default;
    }
    
    /**
     * Get header
     */
    public function header($key, $default = null) {
        $key = strtoupper(str_replace('-', '_', $key));
        return $this->headers[$key] ?? $default;
    }
    
    /**
     * Get all headers
     */
    public function headers() {
        return $this->headers;
    }
    
    /**
     * Get uploaded file
     */
    public function file($key) {
        return $this->files[$key] ?? null;
    }
    
    /**
     * Get all uploaded files
     */
    public function files() {
        return $this->files;
    }
    
    /**
     * Check if request has file
     */
    public function hasFile($key) {
        return isset($this->files[$key]) && $this->files[$key]['error'] === UPLOAD_ERR_OK;
    }
    
    /**
     * Get client IP address
     */
    public function ip() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
    
    /**
     * Get user agent
     */
    public function userAgent() {
        return $_SERVER['HTTP_USER_AGENT'] ?? '';
    }
    
    /**
     * Check if request is AJAX
     */
    public function isAjax() {
        return strtolower($this->header('X-REQUESTED-WITH', '')) === 'xmlhttprequest';
    }
    
    /**
     * Check if request is JSON
     */
    public function isJson() {
        return strpos($this->header('CONTENT-TYPE', ''), 'application/json') !== false;
    }
}
?>
