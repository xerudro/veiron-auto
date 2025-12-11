<?php
/**
 * Router Class - RESTful API Router
 * Handles route registration and dispatching
 */

class Router {
    
    private $routes = [];
    private $middlewareGroups = [];
    private $request;
    
    public function __construct(Request $request) {
        $this->request = $request;
    }
    
    /**
     * Register GET route
     */
    public function get($path, $handler, $middleware = []) {
        $this->addRoute('GET', $path, $handler, $middleware);
    }
    
    /**
     * Register POST route
     */
    public function post($path, $handler, $middleware = []) {
        $this->addRoute('POST', $path, $handler, $middleware);
    }
    
    /**
     * Register PUT route
     */
    public function put($path, $handler, $middleware = []) {
        $this->addRoute('PUT', $path, $handler, $middleware);
    }
    
    /**
     * Register PATCH route
     */
    public function patch($path, $handler, $middleware = []) {
        $this->addRoute('PATCH', $path, $handler, $middleware);
    }
    
    /**
     * Register DELETE route
     */
    public function delete($path, $handler, $middleware = []) {
        $this->addRoute('DELETE', $path, $handler, $middleware);
    }
    
    /**
     * Register OPTIONS route (for CORS preflight)
     */
    public function options($path, $handler, $middleware = []) {
        $this->addRoute('OPTIONS', $path, $handler, $middleware);
    }
    
    /**
     * Add route to routes array
     */
    private function addRoute($method, $path, $handler, $middleware) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
            'middleware' => $middleware,
            'pattern' => $this->pathToPattern($path)
        ];
    }
    
    /**
     * Convert path to regex pattern
     */
    private function pathToPattern($path) {
        // Replace {param} with named capture groups
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $path);
        return '#^' . $pattern . '$#';
    }
    
    /**
     * Dispatch request to appropriate handler
     */
    public function dispatch() {
        $method = $this->request->method();
        $uri = $this->request->uri();
        
        // Handle OPTIONS for CORS
        if ($method === 'OPTIONS') {
            $this->handleCorsPreflight();
        }
        
        // Find matching route
        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }
            
            if (preg_match($route['pattern'], $uri, $matches)) {
                // Extract route parameters
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                $this->request->setParams($params);
                
                // Run middleware
                foreach ($route['middleware'] as $middleware) {
                    $this->runMiddleware($middleware);
                }
                
                // Call handler
                return $this->callHandler($route['handler']);
            }
        }
        
        // No route found
        Response::notFound('Endpoint not found');
    }
    
    /**
     * Call route handler
     */
    private function callHandler($handler) {
        if (is_callable($handler)) {
            // Handler is a closure
            return $handler($this->request);
        }
        
        if (is_array($handler) && count($handler) === 2) {
            // Handler is [ControllerClass, 'method']
            list($controllerClass, $method) = $handler;
            
            if (class_exists($controllerClass)) {
                $controller = new $controllerClass();
                
                if (method_exists($controller, $method)) {
                    return $controller->$method($this->request);
                }
            }
        }
        
        Response::serverError('Invalid route handler');
    }
    
    /**
     * Run middleware
     */
    private function runMiddleware($middlewareName) {
        $middlewareClass = $middlewareName . 'Middleware';
        $middlewarePath = __DIR__ . '/../middleware/' . $middlewareClass . '.php';
        
        if (!file_exists($middlewarePath)) {
            Response::serverError('Middleware not found: ' . $middlewareName);
        }
        
        require_once $middlewarePath;
        
        if (!class_exists($middlewareClass)) {
            Response::serverError('Middleware class not found: ' . $middlewareClass);
        }
        
        $middleware = new $middlewareClass();
        $middleware->handle($this->request);
    }
    
    /**
     * Handle CORS preflight request
     */
    private function handleCorsPreflight() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Max-Age: 3600');
        http_response_code(204);
        exit;
    }
    
    /**
     * Get all registered routes
     */
    public function getRoutes() {
        return $this->routes;
    }
}
?>
