import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { CheckboxFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/checkbox-form-input-element.model';

@Component({
  selector: 'app-register-confirmation',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './register-confirmation.component.html',
  styleUrl: './register-confirmation.component.scss'
})
export class RegisterConfirmationComponent {
  @Output() formCreated = new EventEmitter<FormGroup>();
  formDefinition: DynamicForm;

  constructor() {
    this.buildForm();
  }

  ngAfterViewInit(): void {
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    this.formDefinition = new DynamicForm([
      new CheckboxFormInputElement({
        name: 'acknowledgment1',
        label: 'You are receiving Omnitrope® (somatropin) treatment in New Zealand.',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'acknowledgment2',
        label: 'You understand you may withdraw from the program at any time.',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'acknowledgment3',
        label: 'You understand that in order to manage the program, your personal information will be accessed by the Program Administrator who will collect and store your information in accordance with the <a href = "#" target="_blank">privacy policy</a>.',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'acknowledgment4',
        label: 'You have read, understand and agree to the <a href = "#" target="_blank">privacy policy</a>.',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'acknowledgment5',
        label: 'You consent to the Program Administrator contacting you with program reminders via email, or phone or SMS',
        validation: {
          required: true,
        },
      }),
    ]);
  }
}
