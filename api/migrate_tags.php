<?php
header('Content-Type: text/plain');
require_once 'db_connect.php';

try {
    // Add is_new column
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'is_new'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE products ADD COLUMN is_new TINYINT(1) DEFAULT 0 AFTER category");
        echo "Added 'is_new' column.\n";
    }

    // Add is_limited column
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'is_limited'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE products ADD COLUMN is_limited TINYINT(1) DEFAULT 0 AFTER is_new");
        echo "Added 'is_limited' column.\n";
    }
    
    echo "Migration completed.";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
