import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './auth.guard';
import { routeLinks, routeNames } from './utils/routes';
import { unauthenticatedGuard } from './guards/unauthenticated.guard';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { HowToInjectComponent } from './pages/resources/how-to-inject.component';
import { OrderFormComponent } from './pages/order/order-surepal-device/order-form/order-form.component';
import { OrderSurepalDeviceComponent } from './pages/order/order-surepal-device/order-surepal-device.component';
import { ScheduleInjectionTrainingComponent } from './pages/schedule-injection-training/schedule-injection-training.component';

export const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    canActivate: [unauthenticatedGuard],
    canActivateChild: [unauthenticatedGuard],
    children: [
      {
        path: '',
        redirectTo: routeLinks.landing,
        pathMatch: 'full',
      },
      {
        path: routeNames.authentication,
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then((m) => m.AuthenticationRoutes),
      },
      {
        path: routeNames.landing,
        component: LandingComponent,
      }
    ],
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [unauthenticatedGuard],
    canActivateChild: [unauthenticatedGuard],
    children: [
      {
        path: routeNames.home,
        component: HomeComponent,
      },
      {
        path: routeNames.resources,
        component: HowToInjectComponent
      },
      {
        path: routeNames.order,
        component: OrderSurepalDeviceComponent
      },
      {
        path: routeNames.schedule,
        component: ScheduleInjectionTrainingComponent
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
