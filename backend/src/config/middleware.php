<?php

// add middleware here, such as CSRF or authentication


//$app->add($app->getContainer()->get('auth'));

$app->add(new \cors\CorsMiddleware($app->getContainer()->get('settings')['cors']));


