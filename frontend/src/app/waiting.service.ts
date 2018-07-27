import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class WaitingService {

  private _waitCount: BehaviorSubject<number>;

  public waitCount$: Observable<number>;

  constructor() {
    this._waitCount = new BehaviorSubject(0);
    this.waitCount$ = this._waitCount.asObservable();
  }

  public wait() {
    this._waitCount.next(this._waitCount.getValue() + 1);
  }

  public doneWaiting() {
    this._waitCount.next(this._waitCount.getValue() === 0 ? 0 : this._waitCount.getValue() - 1);
  }

}
