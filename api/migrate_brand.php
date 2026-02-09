<?php
header('Content-Type: text/plain');
require_once 'db_connect.php';

try {
    // Check if column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'brand'");
    $column = $stmt->fetch();

    if (!$column) {
        // Add column if it doesn't exist
        $pdo->exec("ALTER TABLE products ADD COLUMN brand VARCHAR(255) DEFAULT NULL AFTER category");
        echo "Successfully added 'brand' column to products table.";
    } else {
        echo "'brand' column already exists.";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
