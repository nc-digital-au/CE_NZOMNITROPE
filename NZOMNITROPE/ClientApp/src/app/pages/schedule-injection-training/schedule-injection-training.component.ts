import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterLink } from '@angular/router';
import { PatientFormComponent } from 'src/app/components/patient-form/patient-form.component';
import { routeLinks } from 'src/app/utils/routes';
import { GuardianFormComponent } from 'src/app/components/guardian-form/guardian-form.component';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { DateFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/date-form-input-element.model';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { TimeFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/time-form-input-element.model';
import { GetPatientInformationWithCarerResponse, PatientServiceProxy } from 'src/app/services/service-proxies/service-proxies';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';

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
    DynamicFormComponent,
    ReactiveFormsModule,
    MatTimepickerModule,
  ]
})
export class ScheduleInjectionTrainingComponent {
  routeLinks = routeLinks;
  submitting = false;
  enrolmentSuccess = false;
  injectionTrainingForm!: FormGroup;
  injectionSessionFormDefinition!: DynamicForm;
  patientForm  = this.fb.group({});
  guardianForm = this.fb.group({});
  _destroyRef = inject(DestroyRef);
  patientModel: GetPatientInformationWithCarerResponse;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly patientService: PatientServiceProxy
  ) {}

  ngOnInit(): void {

    this.buildForm();
    this.injectionTrainingForm = this.fb.group({
      injectionSession: this.fb.group({}), 
    });
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

  private buildForm(): void {
    this.injectionSessionFormDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'Injection Training Session',
      }),
      new GroupFormElement({
        children: [
          new DateFormInputElement({
            name: 'sessionDate',
            label: 'Date of Training',
            validation: {
              required: true,
            },
          }),
          new TimeFormInputElement({
            name: 'sessionTime',
            label: 'Select Time',
            validation: {
              required: true,
            },
          }),
        ],
      }),
    ]);
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

  onSubmit(): void {
    if (this.injectionTrainingForm.valid) {
      this.submitting = true;

      // Simulate form submission
      console.log('Submitting form data:', this.injectionTrainingForm.value);

      setTimeout(() => {
        this.submitting = false;
        this.enrolmentSuccess = true;
      }, 2000);
    } else {
      console.log('Form is invalid. Please check the required fields.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
