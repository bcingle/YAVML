<?php

namespace cors;

use \Slim\Http\Request;
use \Slim\Http\Response;

class CorsMiddleware {

    private $allowedOrigins = array();

    public function __construct($config = array()) {
        if (isset($config['allowedOrigins'])) {
            $this->allowedOrigins = $config['allowedOrigins'];
            error_log('Allowed origins: ' . join($this->allowedOrigins, ','));
        }
    }

    public function __invoke(Request $request, Response $response, $next) {
        error_log('CorsMiddleware begin');
        if(!$request->isOptions()) {
            // Run inner middleware and application
            error_log('CorsMiddleware calling next');
            $response = $next($request, $response);
        }
        $origin = $request->getHeaderLine('Origin');
        if (empty($this->allowedOrigins)) {
            // no allowed origins, so make it public
            error_log('CorsMiddleware allowing all');
            $response = $response
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        } elseif (in_array($origin, $this->allowedOrigins)) {
            // origin is allowed
            error_log("CorsMiddleware allowing origin ${origin}" );
            $response = $response
                ->withHeader('Access-Control-Allow-Origin', $origin)
                ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        } else {
            error_log("CorsMiddleware denying origin ${origin}");
        }
        error_log('CorsMiddleware end');
        return $response;
    }
}