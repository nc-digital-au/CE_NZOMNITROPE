import { NgModule } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { EligibilityCriteriaDialogComponent } from './patient/eligibility-criteria/eligibility-criteria-dialog/eligibility-criteria-dialog.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(PagesRoutes),
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    EligibilityCriteriaDialogComponent,
    RouterLink
  ],
})
export class PagesModule {}
