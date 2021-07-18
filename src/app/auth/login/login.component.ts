import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

const googleLogoURL = './../../../assets/logo/Google_ G _Logo.svg';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private authListener: Subscription;

  constructor(
    private authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL)
    );
  }

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

  loginWithGoogle() {
    console.log('google login');
    this.authService.loginWithGoogle();
  }
  ngOnDestroy(): void {
    this.authListener.unsubscribe();
  }
}
