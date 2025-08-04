import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Get token from localStorage
  const token = localStorage.getItem('accessToken');

  // Clone the request and add the authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch errors
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        // Clear stored authentication data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
        
        // Redirect to login page
        router.navigate(['/sign-in']);
      }
      
      // Handle 403 Forbidden errors
      if (error.status === 403) {
        // You can show a toast notification here
        console.error('Access denied: Insufficient permissions');
      }

      // Return the error
      return throwError(() => error);
    })
  );
}; 