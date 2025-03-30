import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterLink } from '@angular/router';
import { PatientFormComponent } from 'src/app/components/patient-form/patient-form.component';
import { routeLinks } from 'src/app/utils/routes';
import { GuardianFormComponent } from 'src/app/components/guardian-form/guardian-form.component';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { CarerDto, CreateServiceBookingDto, Gender, GetPatientInformationWithCarerResponse, PatientDto, PatientServiceProxy, ProgramServicesServiceProxy, Title } from 'src/app/services/service-proxies/service-proxies';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionBookingComponent } from './session-booking/session-booking.component';


@Component({
  selector: 'app-schedule-injection-training',
  templateUrl: './schedule-injection-training.component.html',
  styleUrls: ['./schedule-injection-training.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    GuardianFormComponent,
    PatientFormComponent,
    SessionBookingComponent,
    ReactiveFormsModule,
    MatTimepickerModule,
  ]
})
export class ScheduleInjectionTrainingComponent implements OnInit {
  routeLinks = routeLinks;
  submitting = false;
  loading = true
  enrolmentSuccess = false;

  bookingForm: FormGroup;

  patientForm  = this.fb.group({});
  guardianForm = this.fb.group({});
  sessionForm = this.fb.group({});
  _destroyRef = inject(DestroyRef);
  patientModel: GetPatientInformationWithCarerResponse;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly patientService: PatientServiceProxy,
    private readonly bookingService: ProgramServicesServiceProxy,
  ) {}

  ngOnInit(): void {
    this.getPatientInformation();
  }


  private getPatientInformation(): void {
    this.patientService.getPatientInformationWithCarer()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((response) => {
          if(response.isSuccess){
            this.patientModel = response.resultObject;
            this.updatePatientForm(this.patientModel);
            this.updateGuardianForm(this.patientModel);
            this.loading = false;
          }
        })
      )
      .subscribe(({
        next: (result) => {
          if(result.isSuccess){
            this.patientModel = result.resultObject;
          }
        },
        error: (error) => {
          console.error('Error fetching patient information:', error);
        }
      }));
  }

  private updatePatientForm(data: GetPatientInformationWithCarerResponse): void {
    const patientFormData = {
      firstName: data.firstName,
      lastName: data.lastName,
      nhiNumber: data.nationalHealthIndex,
      email: data.email,
      mobile: data.mobileNumber,
    }
    this.patientForm.patchValue(patientFormData);
  }

  private updateGuardianForm(data: GetPatientInformationWithCarerResponse): void {
    if(!data.carer){
      return;
    }
    const guardianFormData = {
      firstName: data.carer.firstName,
      lastName: data.carer.lastName,
      email: data.carer.email,
      mobile: data.carer.mobile
    }
    this.guardianForm.patchValue(guardianFormData);
  }

  onFormSubmit(): void {
    const isValid = this.isFormValid();
    if (this.sessionForm.valid) {
      this.submitting = true;
      const submitDto = this.GetSubmitDto();
      this.bookingService
        .bookService(submitDto)
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          tap((response) => { 
            if (response.isSuccess) {
              this.enrolmentSuccess = true;
              this.submitting = false;
              this.router.navigate(['/']);
            } else {
              this.submitting = false;
            }
          }
        )
        )
        .subscribe({
          next: (result) => {     
            if (result.isSuccess) {
              this.enrolmentSuccess = true;
              this.submitting = false;
              this.router.navigate(['/']);
            } else {
              this.submitting = false;
            }
          }
        }); 
      
    }
  }

  private isFormValid(): boolean {
    this.patientForm.markAllAsTouched();
    this.guardianForm.markAllAsTouched();
    this.sessionForm.markAllAsTouched();
    const sessionFormData = this.sessionForm.value as any;
    console.log('Session Form Data:', sessionFormData);
    return this.patientForm.valid && this.guardianForm.valid && this.sessionForm.valid;
  }

  private GetSubmitDto(): CreateServiceBookingDto {
    const bookingFormData = this.sessionForm.value as any;
    const guardianDto = this.GetGuardianDto();
    const patientDto = this.GetPatientDto();
    return new CreateServiceBookingDto({
      serviceName: 'Injection training',
      bookingDay: bookingFormData.sessionDate.getDate(),
      bookingMonth: bookingFormData.sessionDate.getMonth() + 1,
      bookingYear: bookingFormData.sessionDate.getFullYear(),
      bookingHour: bookingFormData.sessionTime.getHours(),
      bookingMinute: bookingFormData.sessionTime.getMinutes(),
      patient: patientDto,
      carer: guardianDto,
      adminNotificationEmail: environment.trainingAdminEmail,
    });
  }

  private GetPatientDto(): PatientDto {
    const patientFormData = this.patientForm.value as any;
    return new PatientDto({
      title: Title.Unknown,
      firstName: patientFormData.firstName,
      lastName: patientFormData.lastName,
      middleName: undefined,
      email: patientFormData.email,
      medicalReferenceNumber: patientFormData.nhiNumber,
      mobile: undefined,
      birthDay: undefined,
      birthMonth: undefined,
      birthYear: undefined,
      gender: Gender.NotSpecified
    });
  }
  private GetGuardianDto(): CarerDto {
    const guardianFormData = this.guardianForm.value as any;
    return new CarerDto({
      id: undefined,
      title: Title.Unknown,
      middleName: undefined,
      firstName: guardianFormData.firstName,
      lastName: guardianFormData.lastName,        
      email: guardianFormData.email,
      gender: Gender.NotSpecified,
      mobile: guardianFormData.mobile,
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
