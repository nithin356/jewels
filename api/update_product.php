<?php
// Suppress HTML error output - return JSON errors instead
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    require_once 'db_connect.php';
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        exit;
    }
    
    // Get product ID
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    
    if (!$id) {
        echo json_encode(['status' => 'error', 'message' => 'Product ID is required']);
        exit;
    }
    
    // Get other fields
    $name = isset($_POST['name']) ? trim($_POST['name']) : null;
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $price = isset($_POST['price']) ? floatval($_POST['price']) : null;
$max_price = isset($_POST['max_price']) && $_POST['max_price'] !== '' ? floatval($_POST['max_price']) : null;
$category = isset($_POST['category']) ? trim($_POST['category']) : 'Other';
    $brand = isset($_POST['brand']) ? trim($_POST['brand']) : null;
    $collection = isset($_POST['collection']) ? trim($_POST['collection']) : null;
    $is_new = isset($_POST['is_new']) ? (int)$_POST['is_new'] : 0;
    $is_limited = isset($_POST['is_limited']) ? (int)$_POST['is_limited'] : 0;
    
    if (!$name || $price === null) {
        echo json_encode(['status' => 'error', 'message' => 'Name and price are required']);
        exit;
    }
    
    // Handle new image uploads if any
    $newImages = [];
    $uploadDir = __DIR__ . '/uploads/';
    
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to create upload directory']);
            exit;
        }
    }
    
    if (isset($_FILES['images']) && is_array($_FILES['images']['name']) && count($_FILES['images']['name']) > 0 && $_FILES['images']['name'][0] !== '') {
        foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
            if ($tmpName !== '' && is_uploaded_file($tmpName)) {
                $originalName = $_FILES['images']['name'][$key];
                $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
                
                // Validate file extension
                $allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];
                if (!in_array($ext, $allowedExts)) {
                    continue;
                }
                
                $newName = uniqid('product_') . '.' . $ext;
                $targetPath = $uploadDir . $newName;
                
                if (move_uploaded_file($tmpName, $targetPath)) {
                    // Store only filename - frontend will construct full URL
                    $newImages[] = $newName;
                }
            }
        }
    }
    
    // Check if we should keep existing images or replace them
    $keepExisting = isset($_POST['keep_existing_images']) && $_POST['keep_existing_images'] === 'true';
    $existingImagesJson = isset($_POST['existing_images']) ? $_POST['existing_images'] : '[]';
    $existingImages = json_decode($existingImagesJson, true);
    
    if (!is_array($existingImages)) {
        $existingImages = [];
    }
    
    // Merge existing and new images
    if ($keepExisting) {
        $allImages = array_merge($existingImages, $newImages);
    } else {
        $allImages = count($newImages) > 0 ? $newImages : $existingImages;
    }
    
    $imagesJson = json_encode($allImages);
    
    // Update the product in database using PDO
    $stmt = $pdo->prepare("UPDATE products SET name = ?, description = ?, price = ?, max_price = ?, category = ?, brand = ?, collection = ?, is_new = ?, is_limited = ?, images = ? WHERE id = ?");
    $result = $stmt->execute([$name, $description, $price, $max_price, $category, $brand, $collection, $is_new, $is_limited, $imagesJson, $id]);
    
    if ($result) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Product updated successfully',
            'product' => [
                'id' => $id,
                'name' => $name,
                'description' => $description,
                'price' => $price,
                'max_price' => $max_price,
                'category' => $category,
                'brand' => $brand,
                'collection' => $collection,
                'is_new' => $is_new,
                'is_limited' => $is_limited,
                'images' => $allImages
            ]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update product']);
    }
    
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
