import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResourcesRoutes } from './resoucres.routing.module';

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(ResourcesRoutes)],
  ]
})
export class ResourcesModule { }