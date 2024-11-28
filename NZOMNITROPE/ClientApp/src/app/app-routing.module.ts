import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { unauthenticatedGuard } from './guards/unauthenticated.guard';
import { authenticatedGuard } from './guards/authenticated.guard';
import { routeLinks, routeNames } from './utils/routes';

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
        path: routeNames.program,
        loadChildren: () =>
          import('./pages/program/program.module').then((m) => m.ProgramModule),
      },
      {
        path: routeNames.patients,
        loadChildren: () =>
          import('./pages/patient/patient-routing.module').then((m) => m.PatientRoutingModule),
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
