import { Component, OnInit } from '@angular/core';
import { WaitingService } from '../waiting.service';
import { timer } from 'rxjs/observable/timer';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-waiting-spinner',
  templateUrl: './waiting-spinner.component.html',
  styleUrls: ['./waiting-spinner.component.css']
})
export class WaitingSpinnerComponent implements OnInit {

  constructor(private waitingService: WaitingService) { }

  animating = false;

  private subscription: Subscription;
  private char = 0;
  private chars = '⣾⣽⣻⢿⡿⣟⣯⣷';

  ngOnInit() {
    this.waitingService.waitCount$.subscribe(count => {
      console.log(`Wait count: ${count}`);
      if (!this.animating && count > 0) {
        this.animate();
      } else if (this.animating && count === 0) {
        this.stop();
      }
    });
  }

  animate() {
    console.log('Animating');
    const source = timer(0, 100);
    this.subscription = source.subscribe(_ => this.frame());
    this.animating = true;
  }

  stop() {
    console.log('Stopping animation');
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
    this.animating = false; // will be stopped on the next frame
    this.char = 0;
  }

  private frame() {
    this.char = (this.char + 1) % this.chars.length;
  }

}
