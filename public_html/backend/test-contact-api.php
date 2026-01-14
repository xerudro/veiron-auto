<?php
/**
 * Test Contact API locally
 */

// Simulate POST request
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
$_SERVER['HTTP_USER_AGENT'] = 'Test Client';
$_SERVER['HTTP_REFERER'] = 'http://localhost/test';

// Simulate JSON input
$testData = [
    'name' => 'Romeo Alexandru Neacsu',
    'email' => 'ammaildela@gmail.com',
    'phone' => '+40770192117',
    'subject' => 'Test Subject',
    'message' => 'This is a test message from the contact form.',
    'language' => 'en',
    'source_page' => 'contact-en.html'
];

// Mock php://input
file_put_contents('php://input', json_encode($testData));

echo "Testing Contact API...\n";
echo "=====================\n\n";

// Capture output
ob_start();

// Include the API file
include __DIR__ . '/api/public/contact.php';

// Get output
$output = ob_get_clean();

echo "API Response:\n";
echo $output . "\n";

// Try to decode JSON
$response = json_decode($output, true);

if ($response) {
    echo "\nDecoded Response:\n";
    print_r($response);

    if (isset($response['success']) && $response['success']) {
        echo "\n✓ SUCCESS: Contact form is working!\n";
        exit(0);
    } else {
        echo "\n✗ FAILED: " . ($response['message'] ?? 'Unknown error') . "\n";
        if (isset($response['error'])) {
            echo "Error Details: " . $response['error'] . "\n";
        }
        exit(1);
    }
} else {
    echo "\n✗ FAILED: Invalid JSON response\n";
    exit(1);
}
?>
