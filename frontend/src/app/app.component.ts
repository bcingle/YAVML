import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { OnInit } from '@angular/core';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'YAVML';

  constructor(private auth: AuthService, private messages: MessageService) { }

  ngOnInit() {
    this.auth.handleAuthentication();
  }
}
