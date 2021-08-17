<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS
    |--------------------------------------------------------------------------
    |
    | allowedOrigins, allowedHeaders and allowedMethods can be set to array('*')
    | to accept any value.
    |
    */

    'paths' => ['api/*'],
    'supports_credentials' => true,
    'allowed_origins' => [
        env('MAIN_APP_URL', 'http://localhost:3000'),
        env('ADMIN_APP_URL', 'http://localhost:3005'),
        env('MAIN_APP_PREVIEW_URL', 'http://localhost:3000'),
        env('ADMIN_APP_PREVIEW_URL', 'http://localhost:3005')
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'allowed_methods' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,

];
