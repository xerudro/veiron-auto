<?php
/**
 * Database Connection Test Script
 * Tests the Database class and verifies connection
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set response header
header('Content-Type: application/json');

try {
    // Load Database class
    require_once __DIR__ . '/../libs/Database.php';

    $results = [
        'success' => false,
        'tests' => [],
        'config' => null,
        'message' => ''
    ];

    // Test 1: Get database instance
    $results['tests'][] = [
        'name' => 'Get Database Instance',
        'status' => 'running'
    ];

    $db = Database::getInstance();

    $results['tests'][0]['status'] = 'passed';
    $results['tests'][0]['message'] = 'Database instance created successfully';

    // Test 2: Get configuration
    $results['tests'][] = [
        'name' => 'Get Database Configuration',
        'status' => 'running'
    ];

    $config = $db->getConfig();
    $results['config'] = $config;

    $results['tests'][1]['status'] = 'passed';
    $results['tests'][1]['message'] = 'Database configuration loaded';

    // Test 3: Check connection
    $results['tests'][] = [
        'name' => 'Test Connection',
        'status' => 'running'
    ];

    if ($db->isConnected()) {
        $results['tests'][2]['status'] = 'passed';
        $results['tests'][2]['message'] = 'Database connection established';
    } else {
        throw new Exception('Database connection test failed');
    }

    // Test 4: Execute a simple query
    $results['tests'][] = [
        'name' => 'Execute Query',
        'status' => 'running'
    ];

    $testQuery = $db->query('SELECT DATABASE() as current_db, VERSION() as version');

    $results['tests'][3]['status'] = 'passed';
    $results['tests'][3]['message'] = 'Query executed successfully';
    $results['tests'][3]['data'] = $testQuery[0];

    // Test 5: Check if required tables exist
    $results['tests'][] = [
        'name' => 'Verify Tables',
        'status' => 'running'
    ];

    $requiredTables = ['bookings', 'clients', 'cars', 'notifications', 'contact_messages'];
    $existingTables = [];
    $missingTables = [];

    foreach ($requiredTables as $table) {
        $check = $db->queryOne("SHOW TABLES LIKE ?", [$table]);
        if ($check) {
            $existingTables[] = $table;
        } else {
            $missingTables[] = $table;
        }
    }

    if (count($missingTables) > 0) {
        $results['tests'][4]['status'] = 'warning';
        $results['tests'][4]['message'] = 'Some tables are missing: ' . implode(', ', $missingTables);
        $results['tests'][4]['missing_tables'] = $missingTables;
    } else {
        $results['tests'][4]['status'] = 'passed';
        $results['tests'][4]['message'] = 'All required tables exist';
    }

    $results['tests'][4]['existing_tables'] = $existingTables;

    // All tests passed
    $results['success'] = true;
    $results['message'] = 'All database tests completed successfully';

    http_response_code(200);
    echo json_encode($results, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database test failed: ' . $e->getMessage(),
        'tests' => $results['tests'] ?? [],
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT);
}
?>
