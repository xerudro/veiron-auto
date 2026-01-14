<?php
/**
 * Execute migration directly
 */

require_once __DIR__ . '/libs/Database.php';

echo "=== Executing Migration 002 ===\n\n";

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    // Check if table already exists
    $tables = $db->query("SHOW TABLES LIKE 'contact_messages'");
    if (!empty($tables)) {
        echo "✓ Table 'contact_messages' already exists!\n";
    } else {
        echo "Creating table 'contact_messages'...\n";

        $sql = "
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            subject VARCHAR(255),
            message TEXT NOT NULL,
            status ENUM('new', 'read', 'replied', 'archived', 'spam') DEFAULT 'new',
            replied_at TIMESTAMP NULL,
            replied_by INT,
            ip_address VARCHAR(45),
            user_agent TEXT,
            language VARCHAR(2) DEFAULT 'ro',
            source_page VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_status (status),
            INDEX idx_created_at (created_at),
            FULLTEXT idx_message_content (subject, message)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";

        $pdo->exec($sql);
        echo "✓ Table 'contact_messages' created!\n";
    }

    // Check if view exists
    echo "\nCreating/updating view 'unread_contact_messages'...\n";

    $viewSql = "
    CREATE OR REPLACE VIEW unread_contact_messages AS
    SELECT
        id,
        name,
        email,
        phone,
        subject,
        LEFT(message, 100) as message_preview,
        created_at
    FROM contact_messages
    WHERE status = 'new'
    ORDER BY created_at DESC
    ";

    $pdo->exec($viewSql);
    echo "✓ View 'unread_contact_messages' created/updated!\n";

    // Verify
    echo "\n=== Verification ===\n";
    $tables = $db->query("SHOW TABLES");
    echo "Tables in database:\n";
    foreach ($tables as $table) {
        $tableName = array_values($table)[0];
        echo "  - $tableName\n";
    }

    echo "\n✅ Migration completed successfully!\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
?>
