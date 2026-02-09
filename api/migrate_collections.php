<?php
header('Content-Type: text/plain');
require_once 'db_connect.php';

try {
    // Check if collection column exists
    $stmt = $pdo->prepare("SHOW COLUMNS FROM products LIKE 'collection'");
    $stmt->execute();
    $exists = $stmt->fetch();

    if (!$exists) {
        $sql = "ALTER TABLE products ADD COLUMN collection VARCHAR(255) AFTER brand";
        $pdo->exec($sql);
        echo "Successfully added 'collection' column to products table.\n";
    } else {
        echo "'collection' column already exists.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
