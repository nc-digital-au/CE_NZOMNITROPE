import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { AddressComponent } from 'src/app/components/address/address.component';
import { PatientFormComponent } from 'src/app/components/patient-form/patient-form.component';
import { routeLinks } from 'src/app/utils/routes';
import { GuardianFormComponent } from 'src/app/components/guardian-form/guardian-form.component';

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
    ReactiveFormsModule,
    GuardianFormComponent,
    PatientFormComponent
  ],
})
export class ScheduleInjectionTrainingComponent {
  routeLinks = routeLinks;
  submitting = false;
  enrolmentSuccess = false;
  injectionTrainingForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the FormGroup dynamically
    this.injectionTrainingForm = this.fb.group({
      patientDetails: this.buildPatientDetailsForm(),
      injectionSession: this.buildInjectionSessionForm(),
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

  private buildInjectionSessionForm(): FormGroup {
    return this.fb.group({
      sessionDate: ['', Validators.required],
      sessionTime: ['', Validators.required],
      confirmDeviceReceived: [false, Validators.requiredTrue],
    });
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