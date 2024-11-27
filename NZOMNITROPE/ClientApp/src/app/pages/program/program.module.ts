import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgramRoutes } from './program.routing.module';

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(ProgramRoutes)],
  ]
})
export class ProgramModule { }