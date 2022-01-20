<?php

/**
 * This page talks to weatherapi.com.
 */

// API URL.
// You can register for free to get your own api key (fb0... below). 
// forecastUrl returns both current and forecast weather conditions
$forecastUrl = "http://api.weatherapi.com/v1/forecast.json?key=fb0b4c5c22d04c22be2202032210112&aqi=no&days=3&q=";

// Regex that verifies the provided string is either 1. approved characters (a-z with approved symbols of ' or -) or 2. 5 ints, not both
$stringCheck = "/(^[A-Za-z'\-, ]+$|^[0-9]{5}$)/";

// Parse query parameters.
$input = filter_input(INPUT_GET, 'query');
$query = filter_var($input, FILTER_DEFAULT);

// Verify Query follows $stringCheck regex 
$validatedQuery = preg_match($stringCheck, $query);

if ($query && $validatedQuery) {
  $query = urlencode($query);

  // Call the api with the user input query (zip, city, etc.).
  $url = $forecastUrl . $query;
  $data = @file_get_contents($url, true);

  // You can use PHP's error_log to output a string to the log for debugging.
  // error_log($parsed->location->name);
  if ($data == false) {
    $result['error'] = 'Invalid Location';
    $result['input'] = $input;
    http_response_code(404);
    echo json_encode($result);
  } else {
    $parsed = json_decode($data);
    $result['weather'] = $parsed->current->condition->text;
    $result['temp_f'] = $parsed->current->temp_f;
    $result['icon_url'] = $parsed->current->condition->icon;
    $result['city'] = $parsed->location->name;
    $result['state'] = $parsed->location->region;
    $result['forecast'] = $parsed->forecast->forecastday;
    header('Content-Type: application/json');
    echo json_encode($result);
  }
} else {
  $result['error'] = 'Invalid Input';
  $result['input'] = $input;
  http_response_code(400);
  echo json_encode($result);
}
