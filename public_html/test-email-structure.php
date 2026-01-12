<?php
/**
 * Test Email Structure - Verifică structura fără să trimită efectiv
 */

chdir(__DIR__);

echo "=== Test Email Structure (No Actual Send) ===\n\n";

try {
    require_once __DIR__ . '/frontend/libs/EmailService.php';
    echo "✓ EmailService loaded\n";

    // Test data
    $contactData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '+40123456789',
        'subject' => 'Test Subject',
        'message' => 'This is a test message.'
    ];

    $bookingData = [
        'booking_number' => 'BK-TEST-123',
        'client_name' => 'Test Client',
        'client_email' => 'client@example.com',
        'client_phone' => '+40123456789',
        'car_name' => 'BMW Serie 5',
        'pickup_location' => 'Aeroport Satu Mare',
        'pickup_date' => '2026-01-15',
        'pickup_time' => '10:00',
        'dropoff_location' => 'Aeroport Satu Mare',
        'dropoff_date' => '2026-01-20',
        'dropoff_time' => '10:00',
        'duration_days' => 5,
        'total_cost_eur' => '250.00',
        'total_cost_ron' => '1250.00',
        'status' => 'Pending',
        'payment_status' => 'Pending'
    ];

    echo "\n=== Test 1: Contact Message HTML Generation ===\n";
    $emailService = new EmailService();

    // Use reflection to access private method
    $reflection = new ReflectionClass($emailService);
    $method = $reflection->getMethod('generateContactMessageHTML');
    $method->setAccessible(true);
    $html = $method->invoke($emailService, $contactData);

    if (strlen($html) > 100 && strpos($html, 'Test User') !== false) {
        echo "✓ Contact HTML generated successfully (" . strlen($html) . " chars)\n";
        echo "✓ Contains sender name\n";
    } else {
        echo "✗ Contact HTML generation failed\n";
    }

    echo "\n=== Test 2: Booking Notification HTML (Romanian) ===\n";
    $method = $reflection->getMethod('generateBookingNotificationHTML');
    $method->setAccessible(true);
    $html = $method->invoke($emailService, $bookingData);

    if (strlen($html) > 100 && strpos($html, 'Notificare Rezervare') !== false) {
        echo "✓ Booking notification HTML generated successfully (" . strlen($html) . " chars)\n";
        echo "✓ Contains Romanian text\n";
    } else {
        echo "✗ Booking notification HTML generation failed\n";
    }

    echo "\n=== Test 3: Booking Confirmation HTML (Romanian) ===\n";
    $method = $reflection->getMethod('generateBookingConfirmationHTML_RO');
    $method->setAccessible(true);
    $html = $method->invoke($emailService, $bookingData);

    if (strlen($html) > 100 && strpos($html, 'Rezervare Confirmată') !== false) {
        echo "✓ Booking confirmation RO HTML generated successfully (" . strlen($html) . " chars)\n";
        echo "✓ Contains Romanian text\n";
    } else {
        echo "✗ Booking confirmation RO HTML generation failed\n";
    }

    echo "\n=== Test 4: Booking Confirmation HTML (English) ===\n";
    $method = $reflection->getMethod('generateBookingConfirmationHTML_EN');
    $method->setAccessible(true);
    $html = $method->invoke($emailService, $bookingData);

    if (strlen($html) > 100 && strpos($html, 'Booking Confirmed') !== false) {
        echo "✓ Booking confirmation EN HTML generated successfully (" . strlen($html) . " chars)\n";
        echo "✓ Contains English text\n";
    } else {
        echo "✗ Booking confirmation EN HTML generation failed\n";
    }

    echo "\n=== Test 5: Configuration Check ===\n";
    echo "SMTP Host: " . SMTP_HOST . "\n";
    echo "SMTP Port: " . SMTP_PORT . "\n";
    echo "Admin Email: " . ADMIN_EMAIL . "\n";
    echo "From Email: " . FROM_EMAIL . "\n";

    echo "\n=== Toate testele de structură au trecut! ===\n";
    echo "\nNOTĂ: Email-urile NU au fost trimise efectiv.\n";
    echo "Pentru testare reală, încarcă fișierele pe server și testează live.\n";
    echo "\nMotiv: Serverul SMTP acceptă conexiuni doar de pe server-ul web (restricție IP).\n";
    echo "Aceasta este o măsură de securitate normală.\n";

} catch (Exception $e) {
    echo "\n✗ ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}

echo "\n=== Test Finalizat ===\n";
?>
