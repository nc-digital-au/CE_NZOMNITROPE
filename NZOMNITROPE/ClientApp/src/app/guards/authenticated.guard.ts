import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { map } from 'rxjs';
import { routeNames } from '../utils/routes';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  return authService.getIsAuthenticated()
    .pipe(map((response) => {
      if (!response) {
        router.navigate([routeNames.landing], {
          queryParams: { returnUrl: state.url }
        });
      }
      return response;
    }));
};
