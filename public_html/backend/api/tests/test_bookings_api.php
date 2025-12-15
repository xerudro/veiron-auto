<?php
// Simple test script for Bookings API endpoints

function callApi($method, $url, $data = null) {
    $opts = [
        'http' => [
            'method' => $method,
            'header' => "Content-Type: application/json\r\n",
        ]
    ];
    if ($data) {
        $opts['http']['content'] = json_encode($data);
    }
    $context = stream_context_create($opts);
    $result = file_get_contents($url, false, $context);
    return json_decode($result, true);
}

$base = 'http://localhost/api/v1/bookings';

// 1. Create booking
$newBooking = [
    'booking_number' => 'BK' . date('YmdHis'),
    'client_id' => 1,
    'car_id' => 1,
    'pickup_location' => 'Airport',
    'dropoff_location' => 'Hotel',
    'pickup_date' => date('Y-m-d'),
    'pickup_time' => '10:00',
    'dropoff_date' => date('Y-m-d', strtotime('+2 days')),
    'dropoff_time' => '12:00',
    'duration_days' => 2,
    'base_rate_eur' => 50,
    'insurance_cost_eur' => 10,
    'additional_services_cost_eur' => 5,
    'total_cost_eur' => 65,
    'total_cost_ron' => 330,
    'status' => 'pending',
    'payment_status' => 'pending',
    'booking_source' => 'test'
];
$response = callApi('POST', $base, $newBooking);
echo "Create: ", json_encode($response), "\n";

// 2. List bookings
$response = callApi('GET', $base);
echo "List: ", json_encode($response), "\n";

// 3. Get booking by ID
if (!empty($response['data'][0]['id'])) {
    $id = $response['data'][0]['id'];
    $response = callApi('GET', "$base/$id");
    echo "Get: ", json_encode($response), "\n";

    // 4. Update booking
    $update = ['status' => 'confirmed'];
    $response = callApi('PUT', "$base/$id", $update);
    echo "Update: ", json_encode($response), "\n";

    // 5. Delete booking
    $response = callApi('DELETE', "$base/$id");
    echo "Delete: ", json_encode($response), "\n";
}
