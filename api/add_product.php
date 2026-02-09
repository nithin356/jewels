<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=UTF-8");

include 'db_connect.php';

// Check if form data is present
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';
$max_price = isset($_POST['max_price']) && $_POST['max_price'] !== '' ? $_POST['max_price'] : null;
$category = $_POST['category'] ?? 'Other';
$brand = $_POST['brand'] ?? null;
$collection = $_POST['collection'] ?? null;
$is_new = isset($_POST['is_new']) ? (int)$_POST['is_new'] : 0;
$is_limited = isset($_POST['is_limited']) ? (int)$_POST['is_limited'] : 0;

if(empty($name) || empty($price)) {
    http_response_code(400);
    echo json_encode(["message" => "Name and Price are required.", "received" => $_POST]);
    exit;
}

$uploadedImages = [];
$uploadDir = 'uploads/';

// Handle File Uploads
if (isset($_FILES['images'])) {
    $files = $_FILES['images'];
    
    // Check if it's multiple files or a single file
    if(is_array($files['name'])) {
        $count = count($files['name']);
        for ($i = 0; $i < $count; $i++) {
            if ($files['error'][$i] === UPLOAD_ERR_OK) {
                $tmpName = $files['tmp_name'][$i];
                $originalName = basename($files['name'][$i]);
                $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
                
                if(in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'])) {
                    $newName = uniqid('product_') . '.' . $ext;
                    $destination = $uploadDir . $newName;

                    if (move_uploaded_file($tmpName, $destination)) {
                        // Store only filename - frontend will construct full URL
                        $uploadedImages[] = $newName;
                    }
                }
            }
        }
    } else {
        // Single file
        if ($files['error'] === UPLOAD_ERR_OK) {
            $tmpName = $files['tmp_name'];
            $originalName = basename($files['name']);
            $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
            
            if(in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'])) {
                $newName = uniqid('product_') . '.' . $ext;
                $destination = $uploadDir . $newName;

                if (move_uploaded_file($tmpName, $destination)) {
                    // Store only filename - frontend will construct full URL
                    $uploadedImages[] = $newName;
                }
            }
        }
    }
}

try {
    $sql = "INSERT INTO products (name, description, price, max_price, category, brand, collection, is_new, is_limited, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt= $pdo->prepare($sql);
    
    $imagesJson = json_encode($uploadedImages);
    
    if($stmt->execute([$name, $description, $price, $max_price, $category, $brand, $collection, $is_new, $is_limited, $imagesJson])) {
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
