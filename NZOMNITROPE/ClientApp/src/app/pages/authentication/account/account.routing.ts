import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routeNames } from 'src/app/utils/routes';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { userTokenGuard } from 'src/app/guards/user-token.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: routeNames.forgotPassword,
            component: ForgotPasswordComponent,
          },
          {
            path: routeNames.resetPassword,
            canActivate: [userTokenGuard],
            component: ResetPasswordComponent,
          },
        ],
      },
    ]),
  ],
})
export class AccountRoutingModule {}