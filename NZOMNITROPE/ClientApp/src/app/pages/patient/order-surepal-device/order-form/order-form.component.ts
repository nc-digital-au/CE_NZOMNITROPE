import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent {
  orderForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      consumablesKit: ['', Validators.required], 
      penReplacement: ['', Validators.required] 
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      console.log('Form Submitted:', this.orderForm.value);
    } else {
      console.error('Form is invalid');
    }
  }
}
