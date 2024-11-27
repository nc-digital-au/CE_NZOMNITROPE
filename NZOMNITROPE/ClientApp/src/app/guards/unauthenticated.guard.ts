import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { routeNames } from '../utils/routes';

export const unauthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  return authService.getIsAnonymous()
    .pipe(map((response) => {
      if (!response) {
        router.navigate([routeNames.default]);
      }
      return response;
    }));
};
