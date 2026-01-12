<?php
/**
 * Test Contact Form API
 * Testează trimiterea unui email de contact
 */

// Enable error display for testing
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Test Contact Form API</h1>";

// Load email service
try {
    require_once __DIR__ . '/../libs/EmailService.php';
    echo "<p>✓ EmailService loaded successfully</p>";

    // Check if constants are defined
    echo "<p>SMTP_HOST: " . (defined('SMTP_HOST') ? SMTP_HOST : 'NOT DEFINED') . "</p>";
    echo "<p>ADMIN_EMAIL: " . (defined('ADMIN_EMAIL') ? ADMIN_EMAIL : 'NOT DEFINED') . "</p>";

    // Test data
    $testData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '+40123456789',
        'subject' => 'Test Subject',
        'message' => 'This is a test message from the contact form.'
    ];

    echo "<h2>Sending test email...</h2>";

    // Initialize email service
    $emailService = new EmailService();
    echo "<p>✓ EmailService initialized</p>";

    // Send test contact message
    $result = $emailService->sendContactMessage($testData);

    echo "<h2>Result:</h2>";
    echo "<pre>" . print_r($result, true) . "</pre>";

    if ($result['success']) {
        echo "<p style='color: green; font-weight: bold;'>✓ Email sent successfully!</p>";
    } else {
        echo "<p style='color: red; font-weight: bold;'>✗ Email sending failed!</p>";
    }

} catch (Exception $e) {
    echo "<p style='color: red;'><strong>Error:</strong> " . $e->getMessage() . "</p>";
    echo "<p><strong>File:</strong> " . $e->getFile() . "</p>";
    echo "<p><strong>Line:</strong> " . $e->getLine() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?>
