import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { interval } from 'rxjs/observable/interval';
import { delay } from 'rxjs/operators/delay';
import { Subscription } from 'rxjs/Subscription';



@Injectable()
export class MessageService {

  /**
   * An Observable Subject that holds the current message queue
   */
  message$: Subject<string> = new Subject();

  private expirationSubscription: Subscription;

  constructor() { }

  /**
   * Add a message to the queue with an optional expiration delay
   * @param text The message to add
   * @param expire The number of milliseconds to wait before expiring the message (default 5 seconds)
   */
  public push(text: string, expire: number = 7 * 1000) {
    this.clear();
    this.message$.next(text);
    if (expire > 0) {
      this.expirationSubscription = of(expire).pipe(delay(expire)).subscribe(() => {
        this.clear();
      });
    }
  }

  public clear() {
    this.message$.next(null);
    if (this.expirationSubscription) {
      this.expirationSubscription.unsubscribe();
      this.expirationSubscription = null;
    }
  }

}
