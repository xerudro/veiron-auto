<?php
/**
 * Check if notifications table has required columns
 */

require_once __DIR__ . '/libs/Database.php';

try {
    $db = Database::getInstance();

    echo "Checking notifications table structure...\n\n";

    $columns = $db->query("DESCRIBE notifications");

    echo "Current columns:\n";
    foreach ($columns as $col) {
        echo "  - {$col['Field']} ({$col['Type']})\n";
    }

    echo "\n";

    // Check for required columns
    $hasContactMessageId = false;
    $hasNotificationCategory = false;

    foreach ($columns as $col) {
        if ($col['Field'] === 'contact_message_id') {
            $hasContactMessageId = true;
        }
        if ($col['Field'] === 'notification_category') {
            $hasNotificationCategory = true;
        }
    }

    echo "Required columns check:\n";
    echo "  contact_message_id: " . ($hasContactMessageId ? "✓ EXISTS" : "✗ MISSING") . "\n";
    echo "  notification_category: " . ($hasNotificationCategory ? "✓ EXISTS" : "✗ MISSING") . "\n";

    if (!$hasContactMessageId || !$hasNotificationCategory) {
        echo "\n⚠️  Migration 003 needs to be run!\n";
        exit(1);
    } else {
        echo "\n✓ Table structure is correct!\n";
        exit(0);
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
