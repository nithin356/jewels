<?php
/**
 * Setup Users Table for Admin Authentication
 * Run this file once: http://localhost/jewels/api/setup_users.php
 */

header("Content-Type: application/json; charset=UTF-8");

try {
    include 'db_connect.php';
    
    // Create users table
    $createTableSQL = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($createTableSQL);
    
    // Check if admin user exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
    $stmt->execute(['admin']);
    $adminExists = $stmt->fetchColumn() > 0;
    
    if ($adminExists) {
        echo json_encode([
            "status" => "info",
            "message" => "Users table already exists with admin user.",
            "credentials" => [
                "username" => "admin",
                "password" => "admin123" // Already set, don't change
            ]
        ]);
    } else {
        // Create default admin user with password "admin123"
        $adminPassword = password_hash("admin123", PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
        $stmt->execute(['admin', $adminPassword, 'admin@example.com']);
        
        echo json_encode([
            "status" => "success",
            "message" => "Users table created successfully with default admin user!",
            "credentials" => [
                "username" => "admin",
                "password" => "admin123",
                "note" => "Please change this password after first login"
            ]
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Setup failed: " . $e->getMessage()
    ]);
}
?>
