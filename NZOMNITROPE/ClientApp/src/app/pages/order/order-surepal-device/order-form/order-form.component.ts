import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { RadioFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/radio-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';

export enum NeedleKit {
  FourMmNeedleKit = '4mmNeedleKit',
  FiveMmNeedleKit = '5mmNeedleKit',
  EightMmNeedleKit = '8mmNeedleKit',
}

export const NeedleKitLabels: { [key in NeedleKit]: string } = {
  [NeedleKit.FourMmNeedleKit]: '4mm Needle Kit – Contains 300 x 4mm needles, 400 x alcohol wipes, 3 x sharps containers',
  [NeedleKit.FiveMmNeedleKit]: '5mm Needle Kit – Contains 300 x 5mm needles, 400 x alcohol wipes, 3 x sharps containers',
  [NeedleKit.EightMmNeedleKit]: '8mm Needle Kit – Contains 300 x 8mm needles, 400 x alcohol wipes, 3 x sharps containers',
};

export enum PenReplacement {
  FiveMgPen = '5mgPen',
  TenMgPen = '10mgPen',
  FifteenMgPen = '15mgPen',
}

export const PenReplacementLabels: { [key in PenReplacement]: string } = {
  [PenReplacement.FiveMgPen]: '5mg Pen – Contains 1 x 5mg SurePal® Pen (white)',
  [PenReplacement.TenMgPen]: '10mg Pen – Contains 1 x 10mg SurePal® Pen (green)',
  [PenReplacement.FifteenMgPen]: '15mg Pen – Contains 1 x 15mg SurePal® Pen (blue)',
};

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    DynamicFormComponent,
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent {
  formDefinition: DynamicForm;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.fb.group(
      {
        needleKit: [null], // No required validator here
        penReplacement: [null], // No required validator here
      },
      { validators: this.atLeastOneSelected } // Custom validator for at least one selection
    );

    this.formDefinition = new DynamicForm([
      new TitleFormElement({ label: 'Needle Kit Options' }),
      new RadioFormInputElement({
        name: 'needleKit',
        label: 'Select a Needle Kit Option:',
        options: Object.keys(NeedleKit).map((key) => ({
          value: NeedleKit[key as keyof typeof NeedleKit],
          label: NeedleKitLabels[NeedleKit[key as keyof typeof NeedleKit]],
        })),
        errorLabel: 'Needle Kit',
      }),
      new TitleFormElement({ label: 'Pen Replacement' }),
      new RadioFormInputElement({
        name: 'penReplacement',
        label: 'Select a Pen Replacement Option:',
        options: Object.keys(PenReplacement).map((key) => ({
          value: PenReplacement[key as keyof typeof PenReplacement],
          label: PenReplacementLabels[PenReplacement[key as keyof typeof PenReplacement]],
        })),
        errorLabel: 'Pen Replacement',
      }),
    ]);
  }

  private atLeastOneSelected(control: AbstractControl) {
    const needleKit = control.get('needleKit')?.value;
    const penReplacement = control.get('penReplacement')?.value;

    return needleKit || penReplacement ? null : { atLeastOneRequired: true };
  }

  onFormCreated(form: FormGroup): void {
    this.form = form;
  }

  onSubmitForm(): void {
    if (this.form.invalid) {
      console.log('Form is invalid:', this.form.errors);
      return;
    }
    console.log('Form submitted successfully:', this.form.value);
  }
}
