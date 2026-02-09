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

$data = json_decode(file_get_contents("php://input"));

$ids = [];
if (!empty($data->ids) && is_array($data->ids)) {
    $ids = $data->ids;
} elseif (!empty($data->id)) {
    $ids = [$data->id];
}

if (!empty($ids)) {
    try {
        $pdo->beginTransaction();
        $deletedCount = 0;

        foreach ($ids as $id) {
            // 1. Get image paths for each product
            $stmt = $pdo->prepare("SELECT images FROM products WHERE id = ?");
            $stmt->execute([$id]);
            $product = $stmt->fetch();

            if ($product && !empty($product['images'])) {
                $images = json_decode($product['images'], true);
                if (is_array($images)) {
                    foreach ($images as $imageUrl) {
                        $filename = basename($imageUrl);
                        $filePath = 'uploads/' . $filename;
                        if (file_exists($filePath)) {
                            unlink($filePath);
                        }
                    }
                }
            }

            // 2. Delete the database record
            $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
            if ($stmt->execute([$id])) {
                $deletedCount++;
            }
        }

        $pdo->commit();
        echo json_encode([
            "status" => "success",
            "message" => "Successfully deleted $deletedCount product(s) and their associated images.",
            "count" => $deletedCount
        ]);
    } catch(Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(503);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Product ID(s) missing."]);
}
?>
