# Deployment Guide: PHP Backend & MySQL Database

## 1. Server & Database Details
**Host:** 118.139.183.180
**Database:** jewels
**Username:** jewels
**Password:** jewels@123@

## 2. Directory Structure
On your server (in `public_html` or your web root), create this structure:
```
/api/
  ├── db_connect.php
  ├── get_products.php
  ├── add_product.php
  ├── delete_product.php
  └── uploads/         <-- Create this folder and ensure it is writable (chmod 755 or 777)
```

## 3. SQL Setup
Run this in phpMyAdmin. If the table exists, you may need to run the `ALTER` command to add the category column.

**Create Products Table:**
```sql
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    max_price DECIMAL(10, 2),
    category VARCHAR(100) DEFAULT 'Other',
    brand VARCHAR(100),
    collection VARCHAR(100),
    is_new INT DEFAULT 0,
    is_limited INT DEFAULT 0,
    images JSON, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Create Users Table (for Admin Authentication):**
```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Insert Default Admin User:**
```sql
INSERT INTO users (username, password, email) 
VALUES ('admin', '$2y$10$abcdefg...', 'admin@example.com');
```

Or use the automatic setup script:
```
http://localhost/jewels/api/setup_users.php
```

**Update Existing Products Table (if already created):**
```sql
ALTER TABLE products ADD COLUMN brand VARCHAR(100) AFTER category;
ALTER TABLE products ADD COLUMN collection VARCHAR(100) AFTER brand;
ALTER TABLE products ADD COLUMN is_new INT DEFAULT 0 AFTER collection;
ALTER TABLE products ADD COLUMN is_limited INT DEFAULT 0 AFTER is_new;
ALTER TABLE products ADD COLUMN max_price DECIMAL(10, 2) AFTER price;
```

## 4. PHP Files

**File: `api/db_connect.php`**
```php
<?php
$host = '118.139.183.180';
$db   = 'jewels';
$user = 'jewels';
$pass = 'jewels@123@';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database Connection Failed: " . $e->getMessage()]);
    exit;
}
?>
```

**File: `api/add_product.php`**
(Handles File Uploads & Category)
```php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'db_connect.php';

// Check if form data is present
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';
$category = $_POST['category'] ?? 'Other';

if(empty($name) || empty($price)) {
    http_response_code(400);
    echo json_encode(["message" => "Name and Price are required."]);
    exit;
}

$uploadedImages = [];
$uploadDir = 'uploads/';
// Calculate base URL dynamically
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$baseUrl = $protocol . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/';

// Handle File Uploads
if (isset($_FILES['images'])) {
    $files = $_FILES['images'];
    $count = count($files['name']);

    for ($i = 0; $i < $count; $i++) {
        if ($files['error'][$i] === UPLOAD_ERR_OK) {
            $tmpName = $files['tmp_name'][$i];
            $originalName = basename($files['name'][$i]);
            $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
            
            // Allow only images
            if(in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                $newName = uniqid() . '.' . $ext;
                $destination = $uploadDir . $newName;

                if (move_uploaded_file($tmpName, $destination)) {
                    // Store the full URL to the image
                    $uploadedImages[] = $baseUrl . $destination;
                }
            }
        }
    }
}

try {
    $sql = "INSERT INTO products (name, description, price, category, images) VALUES (?, ?, ?, ?, ?)";
    $stmt= $pdo->prepare($sql);
    
    $imagesJson = json_encode($uploadedImages);
    
    if($stmt->execute([$name, $description, $price, $category, $imagesJson])) {
        http_response_code(201);
        echo json_encode(["message" => "Product created successfully."]);
    } else {
        throw new Exception("Database execution failed");
    }
} catch(Exception $e) {
    http_response_code(503);
    echo json_encode(["message" => "Unable to create product.", "error" => $e->getMessage()]);
}
?>
```

**File: `api/get_products.php`**
```php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include 'db_connect.php';

try {
    $stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
    $products = $stmt->fetchAll();
    echo json_encode($products);
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
```

**File: `api/delete_product.php`**
```php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    try {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        if($stmt->execute([$data->id])) {
            echo json_encode(["message" => "Product deleted."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to delete product."]);
        }
    } catch(Exception $e) {
        http_response_code(503);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
```