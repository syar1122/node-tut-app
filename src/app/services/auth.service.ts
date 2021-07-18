import { HttpClient } from '@angular/common/http';
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

  convert_to_seconds(s: String) {
    let seconds_per_unit = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 };

    return +s.slice(0, -1) * seconds_per_unit[s.slice(-1)];
  }

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
    console.log(authData);
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
    console.log(this.convert_to_seconds('10d'), 'converter');
    this.http
      .post<{ message; token; expiresIn; userId }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.token = res.token;

          if (this.token) {
            this.userId = res.user._id;
            const expiresInDuration = this.convert_to_seconds(res.expiresIn);
            this.setAuthTimer(expiresInDuration);

            const now = new Date();
            const expireDate = new Date(now.valueOf() + expiresInDuration);

            this.isAuthenticated = true;
            this.authStatusListener.next(true);

            this.saveAuthData(res.token, expireDate, this.userId);

            this.router.navigate(['/']);

            console.log(this.isAuthenticated, 'login');
          }
        },
        (err) => {
          console.log('err auth', err);
          this.authStatusListener.next(false);
          console.log(this.isAuthenticated, 'login err');
        }
      );
  }

  loginWithGoogle() {
    this.http
      .get('http://localhost:3000/api/user/google')
      .subscribe((res) => {});
    // window.open('http://localhost:3000/api/user/google', 'lank');
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.removeAuthData();
    this.router.navigate(['/']);

    console.log(this.isAuthenticated, 'logOut');
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    console.log(authInformation, 'auto auth user ........');
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

    console.log(this.isAuthenticated, 'auto auth user');
  }

  private setAuthTimer(duration) {
    console.log('setting timer :', duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
      console.log(this.isAuthenticated, 'timer');
    }, duration * 1000);
  }

  private saveAuthData(token: string, expiresIn: Date, userId: string) {
    console.log(token + expiresIn + userId, ' Save auth data');

    localStorage.setItem('token', token);
    localStorage.setItem('expire', expiresIn.toISOString());
    localStorage.setItem('userId', userId);

    console.log(this.isAuthenticated, 'save auth data');
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
    console.log(this.isAuthenticated, 'get auth data');
    return { token: token, expireDate: new Date(expireDate), userId: userId };
  }
}
