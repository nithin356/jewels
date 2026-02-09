<?php
// Start output buffering to catch any unexpected output
ob_start();

// Set error handling to ensure errors don't break JSON output
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Set custom error handler
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    ob_clean();
    http_response_code(500);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(["status" => "error", "message" => "PHP Error: " . $errstr . " (File: $errfile, Line: $errline)"]);
    exit;
});

// Set custom fatal error handler
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_PARSE])) {
        ob_clean();
        http_response_code(500);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode(["status" => "error", "message" => "Fatal Error: " . $error['message'] . " (File: " . $error['file'] . ", Line: " . $error['line'] . ")"]);
        exit;
    }
});

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean();
    exit;
}

// Include database connection
if (!file_exists('db_connect.php')) {
    ob_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "db_connect.php not found"]);
    exit;
}

try {
    include 'db_connect.php';
} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to load database config: " . $e->getMessage()]);
    exit;
}

// Verify connection
if (!isset($pdo)) {
    ob_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection not initialized"]);
    exit;
}

$input = file_get_contents("php://input");
$data = json_decode($input, false);

if (!$data || !isset($data->username) || !isset($data->password) || empty($data->username) || empty($data->password)) {
    ob_clean();
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "message" => "Username and password are required"
    ]);
    exit;
}

try {
    // Check if users table exists
    $stmt = $pdo->prepare("SHOW TABLES LIKE 'users'");
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        ob_clean();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Users table not found. Please create it in the database."]);
        exit;
    }
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$data->username]);
    $user = $stmt->fetch();

    if ($user && password_verify($data->password, $user['password'])) {
        ob_clean();
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Login successful"]);
    } else {
        ob_clean();
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
    }
} catch (PDOException $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}

ob_end_flush();
?>
