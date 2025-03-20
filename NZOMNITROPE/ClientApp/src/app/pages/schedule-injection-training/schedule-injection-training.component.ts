import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { PatientFormComponent } from 'src/app/components/patient-form/patient-form.component';
import { routeLinks } from 'src/app/utils/routes';
import { GuardianFormComponent } from 'src/app/components/guardian-form/guardian-form.component';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { DateFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/date-form-input-element.model';
import { TimeFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/time-form-element.model';

@Component({
  selector: 'app-schedule-injection-training',
  templateUrl: './schedule-injection-training.component.html',
  styleUrls: ['./schedule-injection-training.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    SvgIconComponent,
    GuardianFormComponent,
    PatientFormComponent,
    DynamicFormComponent,
    ReactiveFormsModule,
  ],
})
export class ScheduleInjectionTrainingComponent {
  routeLinks = routeLinks;
  submitting = false;
  enrolmentSuccess = false;
  injectionTrainingForm!: FormGroup;
  injectionSessionFormDefinition!: DynamicForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.injectionTrainingForm = this.fb.group({
      patientDetails: this.buildPatientDetailsForm(),
      injectionSession: this.fb.group({}), // Dynamic form will be set here
    });
  }

  private buildPatientDetailsForm(): FormGroup {
    return this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      suburb: ['', Validators.required],
      state: ['', Validators.required],
      postcode: ['', Validators.required],
    });
  }

  private buildForm(): void {
    this.injectionSessionFormDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'Injection Training Session',
      }),
      new DateFormInputElement({
        name: 'sessionDate',
        label: 'Date of Training',
        validation: {
          required: true,
        },
      }),
      new TimeFormInputElement({
        name: 'sessionTime',
        label: 'Session Time',
        validation: {
          required: true,
        },
      }),
    ]);
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
