import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { routeNames } from 'src/app/utils/routes';
import { OrderSurepalDeviceComponent } from './order-surepal-device/order-surepal-device.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: routeNames.order,
        component: OrderSurepalDeviceComponent,
        data: {
          title: 'Order Form',
          urls: [
            { title: 'My patients', url: '/surepal-device' },
            { title: 'Order Form' }
          ]
        }
      },
    ]),
  ],
  exports: [RouterModule],
})
export class OrderRoutingModule { }