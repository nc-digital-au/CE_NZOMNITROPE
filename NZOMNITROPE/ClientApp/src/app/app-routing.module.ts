import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { unauthenticatedGuard } from './guards/unauthenticated.guard';
import { authenticatedGuard } from './guards/authenticated.guard';
import { routeLinks, routeNames } from './utils/routes';
import { OrderFormComponent } from './pages/order/order-surepal-device/order-form/order-form.component';
import { OrderSurepalDeviceComponent } from './pages/order/order-surepal-device/order-surepal-device.component';
import { ScheduleInjectionTrainingComponent } from './pages/schedule-injection-training/schedule-injection-training.component';

const routes: Routes = [
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
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
      {
        path: routeNames.landing,
        loadChildren: () =>
          import('./pages/landing/landing.module').then(
            (m) => m.LandingModule
          ),
      },
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
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: routeNames.resources,
        loadChildren: () =>
          import('./pages/resources/resources.module').then((m) => m.ResourcesModule),
      },
      {
        path: routeNames.order,
        component: OrderSurepalDeviceComponent,
      },
      {
        path: routeNames.schedule,
        component: ScheduleInjectionTrainingComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: routeLinks.authentication.error,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
