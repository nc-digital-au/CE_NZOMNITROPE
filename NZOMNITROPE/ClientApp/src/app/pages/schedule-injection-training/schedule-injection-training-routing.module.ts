import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { routeNames } from 'src/app/utils/routes';
import { ScheduleInjectionTrainingComponent } from './schedule-injection-training.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: routeNames.schedule,
        component: ScheduleInjectionTrainingComponent,
        data: {
          title: 'Schedule Injection Training',
          urls: [
            { title: 'Schedule Injection Training', url: '/schedule-injection-training' },
            { title: 'Schedule Injection Training' }
          ]
        }
      },
    ]),
  ],
  exports: [RouterModule],
})
export class OrderRoutingModule { }