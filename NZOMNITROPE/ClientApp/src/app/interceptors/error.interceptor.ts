import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ProblemDetails } from '../services/service-proxies/service-proxies';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IToastAlertData, ToastAlertComponent } from '../components/toast-alert/toast-alert.component';

export class ValidationProblem {
  propertyName: string;
  message: string;
}

export class ValidationProblemDetail extends ProblemDetails {
  errors: ValidationProblem[];
}

export class ErrorApiResponse {
  problemDetails: ValidationProblemDetail;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private _snackbacr: MatSnackBar,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(async (err: HttpErrorResponse) => {
      if (request.url.startsWith('/.auth'))
        throw err;

      switch (err.status) {
        case 400:
          var errorResponse = JSON.parse(await (err.error as Blob).text()) as ErrorApiResponse;
          throw errorResponse;
      
        default:
          this._snackbacr.openFromComponent<ToastAlertComponent, IToastAlertData>(
            ToastAlertComponent,
            {
              panelClass: 'ofev-snackbar',
              horizontalPosition: 'right',
              duration: 5000,
              data: {
                message: 'Your request cannot be processed at the moment.<br />Please contact support for help.',
              },
            }
          )
          break;
      }

      throw err;
    }));
  }
}