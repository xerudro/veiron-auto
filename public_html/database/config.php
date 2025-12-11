<?php
/**
 * Database Configuration for VEIRONAUTO
 * Loads database credentials from .env file
 */

// Load environment variables
require_once __DIR__ . '/../config/DotEnv.php';
DotEnv::load(__DIR__ . '/../.env');

// Database connection settings (from .env)
define('DB_HOST', DotEnv::get('DB_HOST', 'localhost'));
define('DB_PORT', DotEnv::get('DB_PORT', '3306'));
define('DB_NAME', DotEnv::get('DB_NAME'));
define('DB_USER', DotEnv::get('DB_USER'));
define('DB_PASS', DotEnv::get('DB_PASS'));

// Database options
define('DB_CHARSET', DotEnv::get('DB_CHARSET', 'utf8mb4'));
define('DB_COLLATION', DotEnv::get('DB_COLLATION', 'utf8mb4_unicode_ci'));

// PDO options
define('PDO_OPTIONS', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);

/**
 * Get database connection
 * @return PDO
 */
function getDBConnection() {
    static $pdo = null;

    if ($pdo === null) {
        try {
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s;charset=%s',
                DB_HOST,
                DB_NAME,
                DB_CHARSET
            );

            $pdo = new PDO($dsn, DB_USER, DB_PASS, PDO_OPTIONS);

            // Set collation if needed
            // $pdo->exec("SET NAMES " . DB_CHARSET . " COLLATE " . DB_COLLATION);

        } catch (PDOException $e) {
            // Log error securely (don't expose in production)
            error_log('Database connection failed: ' . $e->getMessage());

            // Show user-friendly error
            die('Database connection error. Please try again later.');
        }
    }

    return $pdo;
}

/**
 * Test database connection
 * @return bool
 */
function testDBConnection() {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->query('SELECT 1');
        return $stmt !== false;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Get database info for debugging
 * @return array
 */
function getDBInfo() {
    return [
        'host' => DB_HOST,
        'database' => DB_NAME,
        'user' => DB_USER,
        'charset' => DB_CHARSET,
        'collation' => DB_COLLATION,
    ];
}
?>