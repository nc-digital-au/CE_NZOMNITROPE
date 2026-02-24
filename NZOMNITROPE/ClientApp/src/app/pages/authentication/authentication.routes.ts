import { Routes } from '@angular/router';

import { AppErrorComponent } from './error/error.component';
import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
import { userTokenGuard } from 'src/app/guards/user-token.guard';
import { routeNames } from 'src/app/utils/routes';
import { ResetPasswordComponent } from './account/reset-password/reset-password.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from '../landing/landing.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'error',
        component: AppErrorComponent,
      },
      {
        path: routeNames.register,
        component: RegisterComponent,
      },
      {
        path: routeNames.resetPassword,
        canActivate: [userTokenGuard],
        component: ResetPasswordComponent,
      },
      {
        path: '',
        component: LandingComponent,
      },
    ],
  },
];
