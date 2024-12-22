import { RouterModule } from '@angular/router';
import { MyPatientsComponent } from './my-patients/my-patients.component';
import { EnrolPatientComponent } from './enrol-patient/enrol-patient.component';
import { NgModule } from '@angular/core';
import { routeNames } from 'src/app/utils/routes';
import { ReapprovePatientComponent } from './reapprove-patient/reapprove-patient.component';
import { OrderFormComponent } from './order-surepal-device/order-form/order-form.component';
import { OrderSurepalDeviceComponent } from './order-surepal-device/order-surepal-device.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: routeNames.dashboard,
        component: MyPatientsComponent,
        data: {
          title: 'My patients',
          urls: [
            { title: 'My patients', url: '/patients/dashboard' },
            { title: 'My patients' }
          ]
        }
      },
      {
        path: routeNames.enrol,
        component: EnrolPatientComponent,
        data: {
          title: 'Enrol patient',
          urls: [
            { title: 'My patients', url: '/patients/enrol' },
            { title: 'Enrol patient' }
          ]
        }
      },
      {
        path: routeNames.order,
        component: OrderSurepalDeviceComponent,
        data: {
          title: 'Order Form',
          urls: [
            { title: 'My patients', url: '/patients/order' },
            { title: 'Order Form' }
          ]
        }
      },
      {
        path: `${routeNames.reapprove}/:id`,
        component: ReapprovePatientComponent,
        data: {
          title: 'Reapprove patient',
        }
      },
    ]),
  ],
  exports: [RouterModule],
})
export class PatientRoutingModule { }