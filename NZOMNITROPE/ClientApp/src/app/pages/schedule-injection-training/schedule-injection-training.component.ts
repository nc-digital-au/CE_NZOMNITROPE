import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Router, RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { map, Observable } from 'rxjs';
import { AddressComponent } from 'src/app/components/address/address.component';
import { PatientFormComponent } from 'src/app/components/patient-form/patient-form.component';
import { MaterialModule } from 'src/app/material.module';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PatientServiceProxy } from 'src/app/services/service-proxies/service-proxies';
import { InjectionTrainingSessionComponent } from "./injection-training-session/injection-training-session.component";

@Component({
  selector: 'app-schedule-injection-training',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    SvgIconComponent,
    AddressComponent,
    PatientFormComponent,
    InjectionTrainingSessionComponent
],
  templateUrl: './schedule-injection-training.component.html',
  styleUrl: './schedule-injection-training.component.scss'
})
export class ScheduleInjectionTrainingComponent {
  @ViewChild('stepper')
  stepper: MatStepper;

  destroyRef = inject(DestroyRef);
  enrolmentSuccess = false;
  stepperOrientation: Observable<StepperOrientation>;
  patientId: string;
  submitting = false;

  patientForm = this._fb.group({});
  injectionForm = this._fb.group({});


  constructor(
    private readonly _fb: FormBuilder,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _patientService: PatientServiceProxy,
    private readonly _authService: AuthenticationService,
    private readonly _router: Router,
  ) {
    this.stepperOrientation = this._breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  onPatientFormNext() {
    this.stepper.next();
  }

  onFormSubmit() {

  }

}
