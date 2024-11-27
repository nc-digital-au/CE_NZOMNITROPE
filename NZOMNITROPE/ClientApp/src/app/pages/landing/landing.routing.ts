import { Routes } from '@angular/router';
import { LandingComponent } from './landing.component';


export const LandingPageRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: LandingComponent,
      },
    ],
  },
];
