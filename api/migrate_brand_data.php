<?php
header('Content-Type: text/plain');
require_once 'db_connect.php';

try {
    // Update existing NULL brands to 'Other'
    $sql = "UPDATE products SET brand = 'Other' WHERE brand IS NULL OR brand = ''";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    echo "Successfully updated " . $stmt->rowCount() . " products to 'Other' brand.";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
