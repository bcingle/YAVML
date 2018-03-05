import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { WebStorageService } from '../web-storage.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.auth.authChecked$.subscribe(checked => {
      if (checked) {
        // auth has been checked, go to the callback route
        this.router.navigate([this.auth.getCallbackRoute()]);
      }
    });
  }

}
