import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((err: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occured in server !!';
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            errorMessage = 'unAuthorized !!!!';
            this.router.navigate(['/', 'login']);
          }
        }
        if (err.error.message) {
          errorMessage = err.error.message;
        }
        console.log(err.error.message);
        this.dialog.open(ErrorComponent, {
          data: { message: errorMessage },
        });

        return throwError(err);
      })
    );
  }
}
