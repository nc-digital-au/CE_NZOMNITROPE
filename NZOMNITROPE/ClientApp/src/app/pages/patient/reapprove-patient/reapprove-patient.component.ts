import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable, finalize, map, of, switchMap, tap } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SvgIconComponent } from 'angular-svg-icon';
import { PrescriptionComponent } from '../prescription/prescription.component';
import { EligibilityFormComponent } from './eligibility-form/eligibility-form.component';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { GetPatientResponse, PatientServiceProxy, ResupplyPatientDto, TreatmentServiceProxy, TreatmentStatus } from 'src/app/services/service-proxies/service-proxies';
import { PrescriptionFormComponent } from './prescription-form/prescription-form.component';
import { TermsFormComponent } from './terms-form/terms-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RepeatOption } from 'src/app/utils/enums/ofev-data';
import { MatStepper } from '@angular/material/stepper';
import { ValidationProblemDetail } from 'src/app/interceptors/error.interceptor';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { routeLinks } from 'src/app/utils/routes';

@Component({
  selector: 'app-reapprove-patient',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    InlineAlertComponent,
    EligibilityFormComponent,
    PatientFormComponent,
    PrescriptionFormComponent,
    TermsFormComponent,
    SvgIconComponent,
    PrescriptionComponent,
  ],
  templateUrl: './reapprove-patient.component.html',
  styleUrl: './reapprove-patient.component.scss',
})
export class ReapprovePatientComponent {
  patient: GetPatientResponse;

  @Output('closeExpanded')
  closeExpanded: EventEmitter<any> = new EventEmitter();

  @ViewChild('stepper')
  stepper: MatStepper;

  stepperOrientation: Observable<StepperOrientation>;
  destroyRef = inject(DestroyRef);
  submitting = false;
  resupplySuccess = false;
  resupplyProblem: ValidationProblemDetail;

  // forms
  eligibilityForm = this._fb.group({});
  patientForm = this._fb.group({});
  prescriptionForm = this._fb.group({});
  termsForm = this._fb.group({});

  onEligibilityCriteriaNext(): void {
    if (this.eligibilityForm && this.eligibilityForm.valid) {
      const eligibilityData = this.eligibilityForm.value as any;
      if (eligibilityData.criteria1 && eligibilityData.criteria2 == false && eligibilityData.criteria3 && eligibilityData.criteria4) {
        this.stepper.next();
      }
    }
  }

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _treatmentService: TreatmentServiceProxy,
    private readonly _patientService: PatientServiceProxy,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
  ) {
    this.stepperOrientation = this._breakpointObserver
      .observe('(min-width: 950px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this._route.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(paramMap => {
        const id = paramMap.get('id');
        if (id) {
          return this._patientService.getPatient(id);
        }

        return of(null);
      }),
      tap(patient => this.patient = patient.resultObject),
    )
      .subscribe();
  }

  onFormSubmit() {
    if (this.eligibilityForm.valid && this.patientForm.valid && this.prescriptionForm.valid && this.termsForm.valid) {
      const eligibilityData = this.eligibilityForm.value as any;
      const patientData = this.patientForm.value as any;
      const prescriptionData = this.prescriptionForm.value as any;
      const termsData = this.termsForm.value as any;

      this.submitting = true;
      this._treatmentService.resupply(this.patient.id, new ResupplyPatientDto({
        patientId: this.patient.id,
        prescriberNumber: patientData.prescriberNumber,
        patientMobile: patientData.phone,
        patientPhone: patientData.mobile,
        eligibilityCriteriaOptions: [1, 3, 4],
        prescriberId: undefined,
        dosageId: prescriptionData.dose,
        repeats: RepeatOption.Five,
        additionalInstructions: prescriptionData.instructions,
        programId: environment.programId,
      })).pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.submitting = false;
        }),
      ).subscribe({
        next: (response) => {
          this.resupplySuccess = response.isSuccess;
          if (response.isSuccess) {
            this.patient.status = TreatmentStatus.OnContinuedSupply;
          }
        },
        error: (err) => {
          this.resupplySuccess = false;
          this.resupplyProblem = err.problemDetails;
          this.stepper.next();
        },
      });
    }
  }

  onCloseForm(): void {
    this._router.navigate([routeLinks.patients.dashboard]);
  }
}