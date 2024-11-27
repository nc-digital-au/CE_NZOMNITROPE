import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { routeLinks } from '../utils/routes';
import { map, Observable } from 'rxjs';
import { AccountServiceProxy } from '../services/service-proxies/service-proxies';

export const userTokenGuard: CanActivateFn = (route, state): boolean | Observable<boolean> => {
  const router = inject(Router);
  const accountService = inject(AccountServiceProxy);
  let token = route.queryParams['token'];

  if (token) {
    token = token.replaceAll(' ', '+');
    return accountService.validateToken(token)
      .pipe(map(response => {
        if (response.isSuccess && response.resultObject) {
          return true;
        } else {
          router.navigate([routeLinks.authentication.error]);
          return false;
        }
      }));
  }
  router.navigate([routeLinks.authentication.error]);
  return false;
};
