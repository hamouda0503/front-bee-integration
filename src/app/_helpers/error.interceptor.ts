import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error) {
          let errorMessage = 'An unknown error occurred!';
          if (error.error instanceof ErrorEvent) {
            // Client-side or network error occurred. Handle it accordingly.
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Backend returned an unsuccessful response code.
            // Check for specific error codes and provide user-friendly messages.
            if (error.status === 400) { // Assuming 400 for Bad Request
              if (error.error.businessErrorCode) {
                errorMessage = error.error.businessErrorDescription;
              } else {
                errorMessage = `Error Code: ${error.status}; Message: ${error.error.error}`;
              }
            } else {
              // Handle other error codes if needed
              errorMessage = `Error Code: ${error.status}; Message: ${error.error.error}`;
            }
          }
          this.toastr.error(errorMessage, 'Error');
        }
        return throwError(error);
      })
    );
  }
}
