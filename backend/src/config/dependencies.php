<?php

// Add dependencies, such as a logger or PDO

$container = $app->getContainer();

// setup a logger
$settings = $container->get('settings');
if (isset($settings['logger'])) {
    $container['logger'] = function ($c) {
        $settings = $c->get('settings')['logger'];
        $logger = new \Monolog\Logger($settings['name']);
        $logger->pushProcessor(new Monolog\Processor\UidProcessor());
        $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], $settings['level']));
        return $logger;
    };
}

// setup a database connection
if (isset($settings['db'])) {
    $container['db'] = function ($c) {
        $config = $c->get('settings')['db'];
        $connStr = "mysql:host={$config['host']};dbname={$config['dbname']}";
        if (isset($config['port'])) {
            $connStr .= ";port={$config['port']}";
        }
        error_log("Connection string: $connStr");
        $pdo = new PDO($connStr, $config['user'], $config['pass']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    };

    $container['myrouter'] = function ($c) {
        return new \yavml\Router($c);
    };

    $container['userDao'] = function ($c) {
        return new \yavml\UserDAO($c->get('db'));
    };

    $container['fuelDao'] = function ($c) {
        return new \yavml\FuelDAO($c->get('db'));
    };

    $container['maintenanceDao'] = function ($c) {
        return new \yavml\MaintenanceDAO($c->get('db'));
    };

    $container['vehicleDao'] = function ($c) {
        return new \yavml\VehicleDAO($c->get('db'));
    };

    $container['documentDao'] = function ($c) {
        return new \yavml\DocumentDAO($c->get('db'));
    };
}

// setup auth0
if (isset($settings['auth0'])) {
    $container['auth'] = function ($c) {
        return new \auth\Auth0Middleware($c);
    };
}