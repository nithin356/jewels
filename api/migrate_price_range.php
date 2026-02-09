<?php
header('Content-Type: text/plain');
require_once 'db_connect.php';

try {
    // Check if column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE 'max_price'");
    $column = $stmt->fetch();

    if (!$column) {
        // Add column if it doesn't exist
        $pdo->exec("ALTER TABLE products ADD COLUMN max_price DECIMAL(10, 2) DEFAULT NULL AFTER price");
        echo "Successfully added 'max_price' column to products table.";
    } else {
        echo "'max_price' column already exists.";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
