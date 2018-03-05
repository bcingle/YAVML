import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

/**
 * Local storage simulator.  If for some reason there is no local storage
 * (old browser versions?) this can be used to simulate local storage for this
 * session only.  It will not persist across page refresh.
*/
class LocalStorageSim {
  private store = [];
  public getItem(key: string): string {
    return this.store[key];
  }
  public setItem(key: string, value: string) {
    this.store[key] = value;
  }
  public removeItem(key: string) {
    const idx = this.store.indexOf(key);
    if (idx >= 0) {
      this.store.splice(idx, 1);
    }
  }
}

@Injectable()
export class WebStorageService {

  private watchedKeys: Subject<string>[] = [];

  private store = window.localStorage ? window.localStorage : new LocalStorageSim();

  constructor() { }

  public get(key: string): string {
    return window.localStorage.getItem(key);
  }

  public set(key: string, value: string) {
    if (value == null) {
      this.unset(key);
    } else {
      window.localStorage.setItem(key, value);
      this.changed(key, value);
    }
  }

  public unset(key: string) {
    window.localStorage.removeItem(key);
    this.changed(key, null);
  }

  public subscribe(key: string): Observable<string> {
    const listed: Subject<string> = this.getSubject(key);
    return listed.asObservable();
  }

  private changed(key: string, newValue: string) {
    const listed: Subject<string> = this.getSubject(key);
    listed.next(newValue);
  }

  private getSubject(key: string): Subject<string> {
    let listed: Subject<string> = this.watchedKeys[key];
    if (!listed) {
      listed = new Subject();
    }
    return listed;
  }

}
