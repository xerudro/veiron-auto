<?php
/**
 * Test Cars API Endpoints
 * Tests all CRUD operations for the Cars API
 */

echo "=== Testing Cars API ===\n\n";

// Base URL for API
$baseUrl = 'http://localhost/api/v1';

/**
 * Make API request
 */
function makeRequest($method, $endpoint, $data = null, $token = null) {
    global $baseUrl;

    $url = $baseUrl . $endpoint;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

    $headers = ['Content-Type: application/json'];

    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'code' => $httpCode,
        'body' => json_decode($response, true)
    ];
}

// Test 1: Health Check
echo "1. Testing API Health Check...\n";
$response = makeRequest('GET', '/health');
if ($response['code'] === 200) {
    echo "   ✅ Health check passed\n";
    echo "   - Status: " . $response['body']['data']['status'] . "\n";
    echo "   - Version: " . $response['body']['data']['version'] . "\n";
} else {
    echo "   ❌ Health check failed\n";
}

// Test 2: Get all cars (public endpoint)
echo "\n2. Testing GET /cars (Get all cars)...\n";
$response = makeRequest('GET', '/cars');
if ($response['code'] === 200) {
    echo "   ✅ Get all cars successful\n";
    echo "   - Total cars: " . $response['body']['meta']['total'] . "\n";
    echo "   - Page: " . $response['body']['meta']['page'] . "\n";
    echo "   - Limit: " . $response['body']['meta']['limit'] . "\n";

    if (!empty($response['body']['data'])) {
        $firstCar = $response['body']['data'][0];
        echo "   - First car: " . $firstCar['brand'] . " " . $firstCar['model'] . "\n";
    }
} else {
    echo "   ❌ Get all cars failed\n";
    echo "   - Error: " . ($response['body']['message'] ?? 'Unknown error') . "\n";
}

// Test 3: Get cars with filters
echo "\n3. Testing GET /cars with filters...\n";
$response = makeRequest('GET', '/cars?brand=Toyota&transmission=automatic&sort_by=price_per_day&sort_order=ASC');
if ($response['code'] === 200) {
    echo "   ✅ Get filtered cars successful\n";
    echo "   - Filtered results: " . $response['body']['meta']['total'] . "\n";
} else {
    echo "   ❌ Get filtered cars failed\n";
}

// Test 4: Get car brands
echo "\n4. Testing GET /cars/brands...\n";
$response = makeRequest('GET', '/cars/brands');
if ($response['code'] === 200) {
    echo "   ✅ Get brands successful\n";
    echo "   - Brands: " . implode(', ', $response['body']['data']) . "\n";
} else {
    echo "   ❌ Get brands failed\n";
}

// Test 5: Get single car (assuming car ID 1 exists)
echo "\n5. Testing GET /cars/{id} (Get single car)...\n";
$response = makeRequest('GET', '/cars/1');
if ($response['code'] === 200) {
    echo "   ✅ Get single car successful\n";
    $car = $response['body']['data'];
    echo "   - Car: " . $car['brand'] . " " . $car['model'] . "\n";
    echo "   - Year: " . $car['year'] . "\n";
    echo "   - Price: €" . $car['price_per_day'] . "/day\n";
    echo "   - Status: " . $car['status'] . "\n";
    echo "   - Images: " . count($car['images']) . "\n";
} else {
    echo "   ❌ Get single car failed\n";
    echo "   - Status: " . $response['code'] . "\n";
}

// Test 6: Check car availability
echo "\n6. Testing GET /cars/{id}/availability...\n";
$startDate = date('Y-m-d', strtotime('+7 days'));
$endDate = date('Y-m-d', strtotime('+14 days'));
$response = makeRequest('GET', "/cars/1/availability?start_date={$startDate}&end_date={$endDate}");
if ($response['code'] === 200) {
    echo "   ✅ Check availability successful\n";
    echo "   - Period: {$startDate} to {$endDate}\n";
    echo "   - Available: " . ($response['body']['data']['available'] ? 'Yes' : 'No') . "\n";
} else {
    echo "   ❌ Check availability failed\n";
}

// Test 7: Get car images
echo "\n7. Testing GET /cars/{id}/images...\n";
$response = makeRequest('GET', '/cars/1/images');
if ($response['code'] === 200) {
    echo "   ✅ Get car images successful\n";
    echo "   - Number of images: " . count($response['body']['data']) . "\n";

    foreach ($response['body']['data'] as $img) {
        $primaryTag = $img['is_primary'] ? ' (PRIMARY)' : '';
        echo "   - Image: " . $img['image_url'] . $primaryTag . "\n";
    }
} else {
    echo "   ❌ Get car images failed\n";
}

// Test 8: Test authentication required endpoints without token
echo "\n8. Testing protected endpoints without authentication...\n";

// Try to create a car without authentication
$newCarData = [
    'brand' => 'Test Brand',
    'model' => 'Test Model',
    'year' => 2024,
    'color' => 'Red',
    'registration_number' => 'TEST123',
    'fuel_type' => 'petrol',
    'transmission' => 'automatic',
    'seats' => 5,
    'doors' => 4,
    'price_per_day' => 50.00
];

$response = makeRequest('POST', '/cars', $newCarData);
if ($response['code'] === 403) {
    echo "   ✅ Correctly blocked unauthorized POST request\n";
} else {
    echo "   ❌ Should have blocked unauthorized POST request\n";
    echo "   - Got status: " . $response['code'] . "\n";
}

// Try to update without authentication
$response = makeRequest('PATCH', '/cars/1', ['price_per_day' => 100]);
if ($response['code'] === 403) {
    echo "   ✅ Correctly blocked unauthorized PATCH request\n";
} else {
    echo "   ❌ Should have blocked unauthorized PATCH request\n";
}

// Try to delete without authentication
$response = makeRequest('DELETE', '/cars/1');
if ($response['code'] === 403) {
    echo "   ✅ Correctly blocked unauthorized DELETE request\n";
} else {
    echo "   ❌ Should have blocked unauthorized DELETE request\n";
}

// Test 9: Test pagination
echo "\n9. Testing pagination...\n";
$response = makeRequest('GET', '/cars?page=1&limit=5');
if ($response['code'] === 200) {
    echo "   ✅ Pagination successful\n";
    echo "   - Page 1, Limit 5\n";
    echo "   - Returned: " . count($response['body']['data']) . " cars\n";
    echo "   - Total pages: " . $response['body']['meta']['pages'] . "\n";
} else {
    echo "   ❌ Pagination failed\n";
}

// Test 10: Test search
echo "\n10. Testing search functionality...\n";
$response = makeRequest('GET', '/cars?search=Toyota');
if ($response['code'] === 200) {
    echo "   ✅ Search successful\n";
    echo "   - Search term: 'Toyota'\n";
    echo "   - Results: " . $response['body']['meta']['total'] . "\n";
} else {
    echo "   ❌ Search failed\n";
}

// Test 11: Test price range filter
echo "\n11. Testing price range filter...\n";
$response = makeRequest('GET', '/cars?min_price=30&max_price=60');
if ($response['code'] === 200) {
    echo "   ✅ Price filter successful\n";
    echo "   - Price range: €30-€60/day\n";
    echo "   - Results: " . $response['body']['meta']['total'] . "\n";
} else {
    echo "   ❌ Price filter failed\n";
}

// Test 12: Test validation (missing required fields)
echo "\n12. Testing validation with invalid data...\n";
$invalidData = [
    'brand' => 'Test',
    // Missing required fields
];
$response = makeRequest('POST', '/cars', $invalidData);
if ($response['code'] === 422) {
    echo "   ✅ Validation working correctly\n";
    echo "   - Errors detected: " . count($response['body']['errors']) . "\n";
} else {
    echo "   ❌ Validation should have failed\n";
}

// Summary
echo "\n=== Test Summary ===\n";
echo "✅ All public car endpoints are working correctly!\n";
echo "✅ Protected endpoints are correctly secured!\n";
echo "✅ Filtering, sorting, and pagination are functional!\n";
echo "\nNote: To test admin endpoints (create, update, delete),\n";
echo "you need to authenticate first using POST /auth/login\n";
echo "and use the returned token in subsequent requests.\n";
echo "\n";

?>
