import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AUTH_CONFIG } from './auth0-variables';
import { AUTH_CONSTANTS } from './auth0-variables';

import * as auth0 from 'auth0-js';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { catchError, map, tap, share, timeInterval } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MessageService } from '../message.service';
import { WebStorageService } from '../web-storage.service';

@Injectable()
export class AuthService {

  private refreshSubscription: Subscription;

  public readonly authChecked$: Observable<boolean>;
  private _authChecked: BehaviorSubject<boolean> = new BehaviorSubject(false);

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: 'openid'
  });

  constructor(public router: Router, private messages: MessageService, private webStorage: WebStorageService) {
    this.authChecked$ = this._authChecked.asObservable();
  }

  public getIdToken(): string {
    if (this.isAuthenticated()) {
      this.scheduleTokenRenewal();
      return this.getLocalStorage(AUTH_CONSTANTS.idToken);
    } else {
      return null;
    }
  }

  public login(): void {
    this.setCallbackRoute(this.router.url);
    this.auth0.authorize();
  }

  public setCallbackRoute(route) {
    this.setLocalStorage(AUTH_CONSTANTS.callbackRoute, route);
  }

  public getCallbackRoute(): string {
    return this.getLocalStorage(AUTH_CONSTANTS.callbackRoute) || '/';
  }

  public removeCallbackRoute() {
    this.unsetLocalStorage(AUTH_CONSTANTS.callbackRoute);
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        // this.goHome();
      } else if (err) {
        // this.goHome();
        console.log(err);
        this.messages.push(`Auth Error: ${err.error}. Check the console for further details.`);
      }
      this._authChecked.next(true);
    });
  }

  public renewToken() {
    this.auth0.checkSession({
      audience: `https://${AUTH_CONFIG.domain}/userinfo`
    }, (err, result) => {
      if (!err) {
        this.setSession(result);
      }
    });
  }

  public scheduleTokenRenewal() {
    if (!this.isAuthenticated()) {
      return; // if not authenticated, then nothing to renew
    }

    // get the expiration time
    const expiresAt = this.getExpiry();
    // set up an observable that will delay until 30 minutes before expiration
    const source = of(expiresAt).pipe(
      // delay 30 minutes
      map(expiry => interval(Math.max(1, expiry - (1000 * 30) - Date.now())))
    );

    // subscribe, which will effectively call the renewToken() method after the delay
    this.refreshSubscription = source.subscribe(() => this.renewToken());
  }

  public removeTokenRenewalScheduler() {
    if (this.refreshSubscription) {
      // unsubscribe, so that when the delay comes around, it won't renew
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    // persist to local storage
    this.setLocalStorage(AUTH_CONSTANTS.accessToken, authResult.accessToken);
    this.setLocalStorage(AUTH_CONSTANTS.idToken, authResult.idToken);
    this.setLocalStorage(AUTH_CONSTANTS.expiry, expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    this.unsetLocalStorage(AUTH_CONSTANTS.accessToken);
    this.unsetLocalStorage(AUTH_CONSTANTS.idToken);
    this.unsetLocalStorage(AUTH_CONSTANTS.expiry);
    // Go back to the home route
    // this.goHome();
    this.removeTokenRenewalScheduler();
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return new Date().getTime() < this.getExpiry();
  }

  // private goHome() {
  //   this.router.navigate(['/home']);
  // }

  private getExpiry(): number {
    return JSON.parse(this.getLocalStorage(AUTH_CONSTANTS.expiry));
  }

  private getLocalStorage(key: string): string {
    return this.webStorage.get(key);
  }

  private setLocalStorage(key: string, value: string) {
    this.webStorage.set(key, value);
  }

  private unsetLocalStorage(key: string) {
    this.webStorage.unset(key);
  }

}
