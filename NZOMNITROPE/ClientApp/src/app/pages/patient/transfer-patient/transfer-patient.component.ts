import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable, finalize, map } from 'rxjs';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
import { GetPatientsForPrescriberResponse, RequestPatientTranferToNewPrescriberDto, TreatmentServiceProxy, TreatmentStatus } from 'src/app/services/service-proxies/service-proxies';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { HcpFormComponent } from './hcp-form/hcp-form.component';
import { ConsentFormComponent } from './consent-form/consent-form.component';
import { MatStepper } from '@angular/material/stepper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-transfer-patient',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    InlineAlertComponent,
    PatientFormComponent,
    HcpFormComponent,
    ConsentFormComponent,
  ],
  templateUrl: './transfer-patient.component.html',
  styleUrl: './transfer-patient.component.scss',
})
export class TransferPatientComponent {
  @Input({ required: true })
  patient: GetPatientsForPrescriberResponse;

  @Output('closeExpanded')
  closeExpanded: EventEmitter<any> = new EventEmitter();

  @ViewChild('stepper')
  stepper: MatStepper;

  stepperOrientation: Observable<StepperOrientation>;
  destroyRef = inject(DestroyRef);
  submitting = false;

  // forms
  patientForm = this._fb.group({});
  hcpForm = this._fb.group({});
  consentForm = this._fb.group({});

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _treatmentService: TreatmentServiceProxy,
  ) {
    this.stepperOrientation = this._breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  onFormSubmit(): void {
    if (this.patientForm.valid && this.hcpForm.valid && this.consentForm.valid) {
      const patientData = this.patientForm.value as any;
      const hcpData = this.hcpForm.value as any;
      const consentData = this.consentForm.value as any;

      this.submitting = true;
      this._treatmentService.transfer(this.patient.id, new RequestPatientTranferToNewPrescriberDto({
        patientId: this.patient.id,
        phone: patientData.phone,
        mobile: patientData.mobile,
        title: hcpData.title,
        firstName: hcpData.firstName,
        lastName: hcpData.lastName,
        email: hcpData.email,
        prescriberPhone: hcpData.phone,
        prescriberMobile: hcpData.mobile,
        clinicName: hcpData.clinicName,
        clinicContactNumber: hcpData.clinicPhone,
        currentUserId: undefined,
        prescriberId: undefined,
        programId: undefined,
      }))
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            this.submitting = false;
          }),
        ).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.patient.status = TreatmentStatus.TransferRequested;
              this.stepper.next();
            }
          },
        });
    }
  }

  onCloseForm(): void {
    this.closeExpanded.emit();
  }
}
