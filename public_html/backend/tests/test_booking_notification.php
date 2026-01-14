<?php
/**
 * Test Booking Notification System
 * Simulează o rezervare completă și trimite email-uri
 */

echo "=== Veiron Auto - Test Booking Notification ===\n\n";

require_once __DIR__ . '/services/BookingNotificationService.php';

try {
    $service = new BookingNotificationService();
    
    echo "1. Testing email notification with sample booking data...\n\n";
    
    // Folosește funcția de test care deja există în serviciu
    $result = $service->testEmailNotification();
    
    if ($result['success']) {
        echo "✅ SUCCESS! Email notification sent!\n\n";
        echo "Email Details:\n";
        echo "- Booking Number: BK20251210001\n";
        echo "- Car: Audi A3 TFSI\n";
        echo "- Client: Test Client\n";
        echo "- Duration: 5 days (Dec 15-20, 2025)\n";
        echo "- Total: €250.00 (1250.00 RON)\n";
        echo "- Pickup/Dropoff: Satu Mare Airport\n\n";
        echo "📧 Email sent to: " . ADMIN_EMAIL . "\n";
        echo "📝 Message: " . $result['message'] . "\n\n";
    } else {
        echo "❌ FAILED: " . $result['message'] . "\n\n";
        echo "Check:\n";
        echo "1. Email configuration in config/email.php\n";
        echo "2. OpenSSL extension is enabled\n";
        echo "3. SMTP server is accessible\n";
    }
    
    echo "\n=== Test Complete ===\n";
    echo "This demonstrates how emails will be sent when a real booking is created.\n";
    echo "When you build the API, it will use BookingService->createBooking() which\n";
    echo "automatically calls this same notification system.\n";
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
?>
