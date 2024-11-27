import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CONTACT_VALUES } from 'src/app/utils/constants';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, finalize, map } from 'rxjs';
import { StepperOrientation } from '@angular/cdk/stepper';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
import { ConfirmationFormComponent } from './confirmation-form/confirmation-form.component';
import { DiscontinueTreatmentForPatientDto, GetPatientsForPrescriberResponse, TreatmentServiceProxy, TreatmentStatus } from 'src/app/services/service-proxies/service-proxies';
import { MatStepper } from '@angular/material/stepper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValidationProblemDetail } from 'src/app/interceptors/error.interceptor';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-discontinue-patient',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    InlineAlertComponent,
    ConfirmationFormComponent,
  ],
  templateUrl: './discontinue-patient.component.html',
  styleUrl: './discontinue-patient.component.scss',
})
export class DiscontinuePatientComponent {
  @Input({ required: true })
  patient: GetPatientsForPrescriberResponse;

  @Output('closeExpanded')
  closeExpanded: EventEmitter<any> = new EventEmitter();

  @ViewChild('stepper')
  stepper: MatStepper;

  CONTACT_VALUES = CONTACT_VALUES;

  stepperOrientation: Observable<StepperOrientation>;
  destroyRef = inject(DestroyRef);
  submitting = false;
  discontinueSuccess = false;
  discontinueProblem: ValidationProblemDetail;

  // forms
  confirmationForm = this._fb.group({});

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _treatmentService: TreatmentServiceProxy,
  ) {
    this.stepperOrientation = this._breakpointObserver
      .observe('(min-width: 950px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  onFormSubmit() {
    if (this.confirmationForm.valid) {
      const confirmationData = this.confirmationForm.value as any;

      this.submitting = true;
      this._treatmentService.discontinue(this.patient.id, new DiscontinueTreatmentForPatientDto({
        patientId: this.patient.id,
        discontinueReasonId: undefined,
        programId: environment.programId,
        currentUserId: undefined,
      }))
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            this.submitting = false;
          }),
        )
        .subscribe({
          next: (response) => {
            this.discontinueSuccess = response.isSuccess;
            if (response.isSuccess) {
              this.patient.status = TreatmentStatus.Discontinued;
            }
            this.stepper.next();
          },
          error: (err) => {
            this.discontinueSuccess = false;
            this.discontinueProblem = err.problemDetails;
            this.stepper.next();
          },
        });
    }
  }

  onCloseForm() {
    this.closeExpanded.emit();
  }
}
