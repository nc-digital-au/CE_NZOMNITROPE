import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { DateFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/date-form-input-element.model';
import { TimeFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/time-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';

@Component({
  selector: 'app-session-booking',
  imports: [
    DynamicFormComponent
  ],
  templateUrl: './session-booking.component.html',
  styleUrl: './session-booking.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class SessionBookingComponent implements OnInit{
  @Output() formCreated = new EventEmitter<FormGroup>();

  formDefinition: DynamicForm;
  form: FormGroup;

  ngOnInit(): void {
    this.buildForm();
  }
  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }
  private buildForm(): void {
    this.formDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'Session Booking',
      }),
      new DateFormInputElement({
        name: 'sessionDate',
        label: 'Session Date',
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
}
