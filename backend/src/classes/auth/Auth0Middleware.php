<?php

namespace auth;

use Exception;

use \Auth0\SDK\JWTVerifier;
use \Slim\Http\Request;
use \Slim\Http\Response;


/**
 * This middleware will extract the JWT token from the reqeust headers, verify them,
 * and make them available to other middlewares and routes.
 */
class Auth0Middleware {

    /**
     * The JWT verifier - verifies JWT tokens
     */
    private $verifier;

    private $token;
    private $tokenInfo;

    private $container;

    private $logger;

    public function __construct($container) {
        $this->verifier = new JWTVerifier($container->get('settings')['auth0']);
        $this->container = $container;
        $this->logger = $container->get('logger');
    }

    /**
     * Middleware function that looks up the user 
     */
    public function __invoke(Request $request, Response $response, $next) {
        error_log('Authenticated route: ' . $request->getRequestTarget());
        $this->extractToken($request);
        $user = $this->getCurrentUser();
        if (isset($user)) {
            $request = $request->withAttribute('user', $user);
            return $next($request, $response);
        } else {
            $response = $response->withStatus('401');
            return $response;
        }
    }

    public function getUserId() {
        if (isset($this->tokenInfo)) {
            return $this->tokenInfo->sub;
        } else {
            return null;
        }
    }

    public function getCurrentUser() {
        $userId = $this->getUserId();
        if (!isset($userId)) {
            throw new Exception('Auth token not provided');
        }
        $userDao = $this->container->get('userDao');
        $user = $userDao->findUser($userId);
        if (!isset($user)) {
            // create a new record for this newly-authenticated user
            $user = new \yavml\User();
            $user->userId = $userId;
            $user = $userDao->insertUser($user);
        }
        return $user;
    }

    private function extractToken(Request $request) {
        $token = $request->getHeader('Authorization');
        if (isset($token[0])) {
            // verify token
            $token = str_replace('bearer ', '', $token[0]);
            $token = str_replace('Bearer ', '', $token);
            try {
                $this->tokenInfo = $this->verifier->verifyAndDecode($token);
                $this->token = $token;
            } catch (\Exception $e) {
                error_log('Token parsing error: ' . $e->getMessage());
            }
        }
    }
}