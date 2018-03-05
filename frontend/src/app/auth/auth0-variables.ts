interface AuthConfig {
    clientID: string;
    domain: string;
    callbackURL: string;
}

interface AuthConstants {
    accessToken: string;
    idToken: string;
    expiry: string;
    callbackRoute: string;
}

export const AUTH_CONFIG: AuthConfig = {
    clientID: 'omIpUNSfR1NYzV4MXHX3wnCnIQOQ6l5P',
    domain: 'bcingle.auth0.com',
    callbackURL: 'http://localhost:4200/callback'
};

export const AUTH_CONSTANTS: AuthConstants = {
    accessToken: 'access-token',
    idToken: 'id-token',
    expiry: 'expires-at',
    callbackRoute: 'callbackRoute'
};
