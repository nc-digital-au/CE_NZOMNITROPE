import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { FaqsComponent } from './faqs/faqs.component';
import { ResourcesComponent } from './resources/resources.component';

export const ProgramRoutes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'about',
          component: AboutComponent,
          data: {
            title: 'About the Beohringher Ingelheim Medicines Request Program',
            urls: [
              { title: 'Program', url: 'program/about' },
              { title: 'About the Beohringher Ingelheim Medicines Request Program' }
            ]
          }
        },
        {
          path: 'resources',
          component: ResourcesComponent,
          data: {
            title: 'resources',
            urls: [
              { title: 'Program', url: 'program/resources' },
              { title: 'Program resources' }
            ]
          }
        },
        {
          path: 'faqs',
          component: FaqsComponent,
          data: {
            title: 'FAQs',
            urls: [
              { title: 'Program Information', url: 'program/faqs' },
              { title: 'FAQs' }
            ]
          }
        }
      ]
    }
  ];