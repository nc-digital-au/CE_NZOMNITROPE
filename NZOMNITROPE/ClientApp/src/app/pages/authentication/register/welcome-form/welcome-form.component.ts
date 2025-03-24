import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-welcome-form',
  templateUrl: './welcome-form.component.html',
  styleUrls: ['./welcome-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class WelcomeFormComponent {
  @Output() formCreated = new EventEmitter

  welcomeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.buildForm();
  }

  private buildForm(): void {
    this.welcomeForm = this.fb.group({
      barcode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}$/), // Ensure it's exactly 4 digits
        ],
      ],
      consent: [false, Validators.requiredTrue], // Checkbox for consent
    });

    // Emit the form to parent component if needed
    this.formCreated.emit(this.welcomeForm);
  }

  onSubmit(): void {
    if (this.welcomeForm.valid) {
      console.log('Form Submitted:', this.welcomeForm.value);
    } else {
      console.error('Form is invalid');
    }
  }
}
