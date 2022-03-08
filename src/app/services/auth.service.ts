import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:3000/api/auth/';
  private token: string;
  private userId: string;
  private user: any;
  private tokenTimer: NodeJS.Timer;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  convert_to_milliseconds(s: String) {
    let seconds_per_unit = {
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000,
      w: 604800000,
    };

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

  getCurrentUser() {
    return this.user;
  }

  createUser(email: string, pass: string) {
    const authData = {
      email: email,
      password: pass,
    };
    console.log(authData);
    this.http.post(this.authUrl + 'signup', authData).subscribe(
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

    this.http
      .post<{ message; token; expiresIn; userId }>(
        this.authUrl + 'login',
        authData
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.user = res.user;
          this.token = res.token;

          if (this.token) {
            this.userId = res.user._id;
            const expiresInDuration = this.convert_to_milliseconds(
              res.expiresIn
            );
            this.setAuthTimer(expiresInDuration);
            console.log('expires in duration', expiresInDuration);

            const now = new Date();
            console.log('now', now.valueOf());
            const expireDate = new Date(now.valueOf() + expiresInDuration);
            console.log('expire date ', expireDate);

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

  // loginWithGoogle() {
  //   // this.http
  //   //   .get('http://localhost:3000/api/user/google')
  //   //   .subscribe((res) => console.log(res));
  //   let newW = window.open('http://localhost:3000/api/user/google', '_blank');
  //   let timer: NodeJS.Timeout | null = null;
  //   let resF: boolean = false;

  //   console.log('new window ', newW.location);

  //   if (newW) {
  //     timer = setInterval(async () => {
  //       if (newW.closed) {
  //         resF = true;
  //         console.log('window closed', timer);
  //         this.http
  //           .get('http://localhost:3000/api/user/auth')
  //           .subscribe((res) => {
  //             console.log(res);
  //           });
  //         if (timer) clearInterval(timer);
  //       }
  //     }, 500);
  //   }
  //   console.log('res flag : ', resF);
  // }

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
    const expireTime = authInformation.expireDate.valueOf() - now.valueOf();
    console.log(
      'auto auth expire date',
      authInformation.expireDate.getTime(),
      now.getTime()
    );
    if (expireTime > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expireTime);
      console.log('expire time', expireTime);
      this.authStatusListener.next(true);
    }

    console.log(this.isAuthenticated, 'auto auth user');
  }

  private setAuthTimer(duration) {
    console.log('setting timer :', duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
      console.log(this.isAuthenticated, 'timer');
    }, duration);
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
