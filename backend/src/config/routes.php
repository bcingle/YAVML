<?php

// add routes here

// authenticated route
$app->get('/vehicles', function ($request, $response, $args) {
    // 'user' attribute is added by middleware
    $user = $request->getAttribute('user');
    return $this->get('myrouter')->getVehicles($user, $request, $response, $args);
})->add($app->getContainer()->get('auth')); // add the auth middleware

$app->post('/vehicles', function ($request, $response, $args) {
    $user = $request->getAttribute('user');
    return $this->get('myrouter')->addVehicle($user, $request, $response, $args);
})->add($app->getContainer()->get('auth'));

$app->get('/vehicles/{id}', function ($request, $response, $args) {
    $user = $request->getAttribute('user');
    return $this->get('myrouter')->getVehicle($user, $request, $response, $args);
})->add($app->getContainer()->get('auth'));

$app->delete('/vehicles/{id}', function ($request, $response, $args) {
    $user = $request->getAttribute('user');
    return $this->get('myrouter')->deleteVehicle($user, $request, $response, $args);
})->add($app->getContainer()->get('auth'));

$app->get('/vehicles/{id}/documents', function ($request, $response, $args) {
    $user = $request->getAttribute('user');
    return $this->get('myrouter')->getDocumentsForVehicle($user, $request, $response, $args);
})->add($app->getContainer()->get('auth'));

$app->post('/vehicles/{id}/documents', function ($request, $response, $args) {
    $user = $request->getAttribute('user');
    return $this->get('myrouter')->addDocumentForVehicle($user, $request, $response, $args);
})->add($app->getContainer()->get('auth'));

$app->delete('/vehicles/{vehicleId}/documents/{documentId}', function ($request, $response, $args) {
    $user = $request->getAttribute('user');
    return $this->get('myrouter')->deleteDocument($user, $request, $response, $args);
})->add($app->getContainer()->get('auth'));

$app->get('/vehicles/download/{documentId}', function ($request, $response, $args) {
    $user = $request->getAttribute('user');
    return $this->get('myrouter')->fetchDocument($user, $request, $response, $args);
})->add($app->getContainer()->get('auth'));

// publicly accessible route 
$app->get('/public', function ($response) {
    return $response->withJson(['data' => 'Hello World']);
});


