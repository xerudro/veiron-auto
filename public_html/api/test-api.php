<?php
/**
 * Simple API Test Script
 * Tests the core framework without HTTP server
 */

echo "=== VEIRONAUTO API Test ===\n\n";

// Simulate HTTP request environment
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/api/v1/health';
$_SERVER['HTTP_HOST'] = 'localhost';

// Load API
require_once __DIR__ . '/v1/index.php';
?>
