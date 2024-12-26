import { Routes } from '@angular/router';
import { HowToInjectComponent } from './how-to-inject.component';

export const ResourcesRoutes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'how-to-inject',
          component: HowToInjectComponent,
          data: {
            title: 'how-to-inject',
            urls: [
              { title: 'how-to-inject', url: '/how-to-inject' },
              { title: 'how-to-inject' }
            ]
          }
        }
      ]
    }
  ];