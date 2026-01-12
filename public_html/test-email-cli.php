<?php
/**
 * Test Email CLI - Rulează din linie de comandă
 * Testează dacă PHPMailer poate trimite email-uri
 */

// Change to project root
chdir(__DIR__);

echo "=== Test Email PHPMailer ===\n\n";

// Load email service
try {
    require_once __DIR__ . '/frontend/libs/EmailService.php';
    echo "✓ EmailService loaded\n";

    // Test data
    $testData = [
        'name' => 'Test User (CLI)',
        'email' => 'test@example.com',
        'phone' => '+40123456789',
        'subject' => 'Test Contact Form',
        'message' => 'This is a test message sent from CLI to verify PHPMailer configuration.'
    ];

    echo "\nTrimet email de test către: " . ADMIN_EMAIL . "\n";
    echo "De la: {$testData['name']} ({$testData['email']})\n\n";

    // Initialize email service
    $emailService = new EmailService();
    echo "✓ EmailService initialized\n\n";

    // Send test contact message
    echo "Se trimite email-ul...\n";
    $result = $emailService->sendContactMessage($testData);

    echo "\n=== Rezultat ===\n";
    if ($result['success']) {
        echo "✓ SUCCESS: " . $result['message'] . "\n";
        echo "\nVerifică inbox-ul la: " . ADMIN_EMAIL . "\n";
    } else {
        echo "✗ FAILED: " . $result['message'] . "\n";
    }

} catch (Exception $e) {
    echo "\n✗ ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "\nStack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n=== Test Finalizat ===\n";
?>
