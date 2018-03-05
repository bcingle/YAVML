<?php

namespace cors;

use \Slim\Http\Request;
use \Slim\Http\Response;

class CorsMiddleware {

    public function __invoke(Request $request, Response $response, $next) {
        error_log('CorsMiddleware begin');
        if(!$request->isOptions()) {
            // Run inner middleware and application
            error_log('CorsMiddleware calling next');
            $response = $next($request, $response);
        }
        $response = $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        error_log('CorsMiddleware end');
        return $response;
    }
}