import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private authListener: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authListener = this.authService
      .getAuthStatus()
      .subscribe((authState) => {
        this.isLoading = false;
      });
  }

  login(form: NgForm) {
    console.log(form.value);

    this.authService.login(form.value.email, form.value.pass);
    this.isLoading = true;
  }

  ngOnDestroy(): void {
    this.authListener.unsubscribe();
  }
}
