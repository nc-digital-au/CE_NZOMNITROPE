import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { DateFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/date-form-input-element.model';
import { TimeFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/time-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';

@Component({
  selector: 'app-session-booking',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './session-booking.component.html',
  styleUrl: './session-booking.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class SessionBookingComponent implements OnInit {
  @Output() formCreated = new EventEmitter<FormGroup>();

  formDefinition: DynamicForm;
  form: FormGroup;

  private todayMidnight: Date;

  ngOnInit(): void {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    this.todayMidnight = t;
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.form = form;

    const dateCtrl = this.form.get('sessionDate');
    const timeCtrl = this.form.get('sessionTime');

    dateCtrl?.addValidators(this.noPastDateValidator.bind(this));
    dateCtrl?.updateValueAndValidity({ emitEvent: false });

    const validateTimeWindow = () => {
      if (!dateCtrl) return;
      const dateVal = dateCtrl.value;
      if (!dateVal || dateCtrl.invalid) {
        this.clearSpecificError(timeCtrl, 'withinNextHour');
        return;
      }
      const selectedDate = this.normaliseDate(dateVal);
      const today = new Date();
      const nowPlus1h = new Date();
      nowPlus1h.setHours(today.getHours(), today.getMinutes() + 60, 0, 0);

      // Only enforce when session date is today
      if (selectedDate.getTime() !== this.todayMidnight.getTime()) {
        this.clearSpecificError(timeCtrl, 'withinNextHour');
        return;
      }

      const sessionDateTime = this.composeDateTime(selectedDate, timeCtrl?.value);
      if (!sessionDateTime || isNaN(sessionDateTime.getTime())) {
        this.clearSpecificError(timeCtrl, 'withinNextHour');
        return;
      }

      if (sessionDateTime < nowPlus1h) {
        this.setSpecificError(timeCtrl, 'withinNextHour', true);
      } else {
        this.clearSpecificError(timeCtrl, 'withinNextHour');
      }
    };

    dateCtrl?.valueChanges.subscribe(validateTimeWindow);
    timeCtrl?.valueChanges.subscribe(validateTimeWindow);

    validateTimeWindow();

    this.formCreated.emit(this.form);
  }

  private buildForm(): void {
    this.formDefinition = new DynamicForm([
      new TitleFormElement({ label: 'Session Booking' }),
      new DateFormInputElement({
        name: 'sessionDate',
        label: 'Session Date',
        validation: { required: true },
        minDate: this.todayMidnight as any,
        startAt: this.todayMidnight as any,
      } as any),
      new TimeFormInputElement({
        name: 'sessionTime',
        label: 'Session Time',
        validation: { required: true },
      }),
    ]);
  }


  private noPastDateValidator(control: AbstractControl): ValidationErrors | null {
    const v = control.value;
    if (!v) return null;
    const picked = this.normaliseDate(v);
    return picked < this.todayMidnight ? { pastDate: true } : null;
  }

  private normaliseDate(val: any): Date {
    const d = val instanceof Date ? new Date(val) : new Date(val);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private composeDateTime(baseDate: Date, timeVal: any): Date | null {
    if (!timeVal) return null;

    if (typeof timeVal === 'string') {
      const m = /^(\d{1,2}):(\d{2})$/.exec(timeVal.trim());
      if (!m) return null;
      const hours = Number(m[1]);
      const minutes = Number(m[2]);
      if (isNaN(hours) || isNaN(minutes)) return null;
      const dt = new Date(baseDate);
      dt.setHours(hours, minutes, 0, 0);
      return dt;
    }

    if (timeVal instanceof Date) {
      const dt = new Date(baseDate);
      dt.setHours(timeVal.getHours(), timeVal.getMinutes(), 0, 0);
      return dt;
    }

    if (typeof timeVal === 'object' && timeVal !== null) {
      const hours = Number((timeVal as any).hour ?? (timeVal as any).hours);
      const minutes = Number((timeVal as any).minute ?? (timeVal as any).minutes);
      if (isNaN(hours) || isNaN(minutes)) return null;
      const dt = new Date(baseDate);
      dt.setHours(hours, minutes, 0, 0);
      return dt;
    }

    return null;
  }

  private setSpecificError(ctrl: AbstractControl | null | undefined, key: string, value: any): void {
    if (!ctrl) return;
    const current = ctrl.errors ?? {};
    if (current[key] === value) return;
    ctrl.setErrors({ ...current, [key]: value });
  }

  private clearSpecificError(ctrl: AbstractControl | null | undefined, key: string): void {
    if (!ctrl || !ctrl.errors) return;
    const { [key]: _, ...rest } = ctrl.errors;
    ctrl.setErrors(Object.keys(rest).length ? rest : null);
  }
}
