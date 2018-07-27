<?php

return [
    'settings' => [
        'displayErrorDetails' => true,
        'addContentLengthHeaders' => false,
        'logger' => [
            'name' => 'slim-app',
            'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../../logs/app.log',
            'level' => \Monolog\Logger::DEBUG
        ],
        'db' => [
            'host' => 'localhost',
            'user' => 'yavml',
            'pass' => '1YgCxPQADp9lMe2i',
            'dbname' => 'yavml',
            'port' => 3306
        ],
        'auth0' => [
            'supported_algs' => ['RS256'],
            'valid_audiences' => ['omIpUNSfR1NYzV4MXHX3wnCnIQOQ6l5P'],
            'authorized_iss' => ['https://bcingle.auth0.com/']
        ],
        'cors' => [
            'allowedOrigins' => [
                'http://localhost:4200'
            ]
        ],
        'uploadDir' => __DIR__ . '/../../data'
    ]
];