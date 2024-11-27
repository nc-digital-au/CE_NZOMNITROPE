import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class CsrfHeaderInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.headers.has("X-CSRF")) {
      request = request.clone({
        headers: request.headers.set("X-CSRF", "1"),
      });
    }
    
    const programId = environment.programId;
    if (!request.headers.has("X-ProgramId") && programId) {
      request = request.clone({
        headers: request.headers.set("X-ProgramId", programId),
      });
    }

    return next.handle(request);
  }
}

