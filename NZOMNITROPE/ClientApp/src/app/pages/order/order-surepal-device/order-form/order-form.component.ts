import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

export enum NeedleKit {
  FourMmNeedleKit = '4mmNeedleKit',
  FiveMmNeedleKit = '5mmNeedleKit',
  EightMmNeedleKit = '8mmNeedleKit',
}

export const NeedleKitLabels: { [key in NeedleKit]: string } = {
  [NeedleKit.FourMmNeedleKit]: 'SKU 4mm Needle Kit – Contains 300 x 4mm needles, 400 x alcohol wipes, 3 x sharps containers',
  [NeedleKit.FiveMmNeedleKit]: 'SKU 5mm Needle Kit – Contains 300 x 5mm needles, 400 x alcohol wipes, 3 x sharps containers',
  [NeedleKit.EightMmNeedleKit]: 'SKU 8mm Needle Kit – Contains 300 x 8mm needles, 400 x alcohol wipes, 3 x sharps containers',
};

export enum PenReplacement {
  FiveMgPen = '5mgPen',
  TenMgPen = '10mgPen',
  FifteenMgPen = '15mgPen',
}

export const PenReplacementLabels: { [key in PenReplacement]: string } = {
  [PenReplacement.FiveMgPen]: 'SKU 5mg Pen – Contains 1 x 5mg SurePal® Pen (white)',
  [PenReplacement.TenMgPen]: 'SKU 10mg Pen – Contains 1 x 10mg SurePal® Pen (green)',
  [PenReplacement.FifteenMgPen]: 'SKU 15mg Pen – Contains 1 x 15mg SurePal® Pen (blue)',
};

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
  needleKitOptions = Object.keys(NeedleKit).map(key => ({
    value: NeedleKit[key as keyof typeof NeedleKit],
    label: NeedleKitLabels[NeedleKit[key as keyof typeof NeedleKit]],
  }));
  penReplacementOptions = Object.keys(PenReplacement).map(key => ({
    value: PenReplacement[key as keyof typeof PenReplacement],
    label: PenReplacementLabels[PenReplacement[key as keyof typeof PenReplacement]],
  }));

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
