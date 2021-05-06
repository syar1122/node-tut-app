import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSub: Subscription;
  constructor(private authService: AuthService) {}
  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService
      .getAuthStatus()
      .subscribe((result) => (this.userIsAuthenticated = result));
  }

  logout() {
    this.authService.logout();
  }
}
