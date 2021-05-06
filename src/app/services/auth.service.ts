import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private userId: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.authStatusListener.asObservable();
  }
  getIsAuth(): boolean {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }

  createUser(email: string, pass: string) {
    const authData = {
      email: email,
      password: pass,
    };
    this.http.post('http://localhost:3000/api/user/signup', authData).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/', 'login']);
      },
      (err) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, pass: string) {
    const authData = {
      email: email,
      password: pass,
    };
    console.log(authData);
    this.http
      .post<{ message; token; expiresIn; userId }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.token = res.token;
          if (res.token) {
            this.userId = res.userId;
            const expiresInDuration = res.expiresIn;
            this.setAuthTimer(expiresInDuration);
            const now = new Date();
            const expireDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(this.token, expireDate, this.userId);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
          }
        },
        (err) => {
          this.authStatusListener.next(false);
        }
      );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.removeAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expireTime = authInformation.expireDate.getTime() - now.getTime();
    if (expireTime > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expireTime / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration) {
    console.log('setting timer :', duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expiresIn: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expire', expiresIn.toISOString());
    localStorage.setItem('userId', userId);
  }

  private removeAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expire');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expireDate = localStorage.getItem('expire');
    const userId = localStorage.getItem('userId');
    if (!token || !expireDate) {
      return null;
    }
    return { token: token, expireDate: new Date(expireDate), userId: userId };
  }
}
