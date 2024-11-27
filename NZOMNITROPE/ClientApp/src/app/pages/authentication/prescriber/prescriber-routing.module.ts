import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PrescriberComponent } from './prescriber.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PrescriberComponent,
        children: [
          {
            path: 'register',
            component: RegisterComponent,
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class PrescriberRoutingModule {}