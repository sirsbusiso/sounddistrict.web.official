import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const authReq = req.clone({
    withCredentials: true,
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error.status, error);

      let message = 'Something went wrong';
      let panelClass: string[] = ['snack-error'];

      switch (error.status) {
        case 0:
          message = 'Network error. Please check your connection.';
          panelClass = ['snack-error'];
          break;
        case 200:
          snackBar.open('Request successful.', 'Close', {
            duration: 3000,
            panelClass: ['success-snack'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          break;
        case 400:
          message = error.error?.message || 'Invalid request.';
          panelClass = ['snack-warning'];
          break;
        case 409:
          snackBar.open(error.error?.message || 'Error occurred.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          break;
        case 401:
          snackBar.open('Session expired. Please log in again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          router.navigate(['/']);
          return throwError(() => error);

        case 403:
          message = 'You do not have permission.';
          panelClass = ['snack-warning'];
          break;

        case 404:
          message = 'Resource not found.';
          break;

        case 500:
        case 502:
        case 503:
          message = 'Server error. Please try again later.';
          panelClass = ['snack-error'];

          break;
      }

      return throwError(() => error);
    }),
  );
};
