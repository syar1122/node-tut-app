import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css'],
})
export class SingUpComponent implements OnInit, OnDestroy {
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

  signUp(form: NgForm) {
    console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
    this.isLoading = true;
  }

  ngOnDestroy(): void {
    this.authListener.unsubscribe();
  }
}
