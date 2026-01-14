<?php
require_once __DIR__ . '/libs/Database.php';

try {
    $db = Database::getInstance();

    echo "Checking notification_category enum values...\n\n";

    $result = $db->query("SHOW COLUMNS FROM notifications WHERE Field = 'notification_category'");

    if (!empty($result)) {
        echo "Column: notification_category\n";
        echo "Type: " . $result[0]['Type'] . "\n";

        // Extract enum values
        preg_match("/^enum\(\'(.*)\'\)$/", $result[0]['Type'], $matches);
        if (isset($matches[1])) {
            $values = explode("','", $matches[1]);
            echo "\nAllowed values:\n";
            foreach ($values as $v) {
                $check = ($v === 'contact_message') ? ' ✓ (needed for contact form)' : '';
                echo "  - '$v'$check\n";
            }
        }
    }

    // Also check notification_type
    echo "\n\nChecking notification_type enum values...\n\n";
    $result2 = $db->query("SHOW COLUMNS FROM notifications WHERE Field = 'notification_type'");

    if (!empty($result2)) {
        echo "Column: notification_type\n";
        echo "Type: " . $result2[0]['Type'] . "\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
