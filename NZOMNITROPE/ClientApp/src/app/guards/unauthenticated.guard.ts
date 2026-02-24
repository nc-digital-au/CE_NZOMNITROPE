import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs';
import { routeNames } from '../utils/routes';

export const unauthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  
  return authService.getIsAnonymous(true).pipe(
    tap(isAnonymous => {
      if (!isAnonymous) {
        router.navigate([routeNames.default]);
      }
    }),
    map(isAnonymous => isAnonymous)
  );
};
