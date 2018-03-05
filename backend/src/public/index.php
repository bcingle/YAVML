<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

// autoload vendor libraries and classes
require __DIR__ . '/../vendor/autoload.php';

// load configuration settings
$config = require __DIR__ . '/../config/settings.php';

// create the app from settings
$app = new \Slim\App($config);

// load dependencies, which will add injectable objects to the app
require __DIR__ . '/../config/dependencies.php';

// add middleware
require __DIR__ . '/../config/middleware.php';

// add routes
require __DIR__ . '/../config/routes.php';


$app->run();
