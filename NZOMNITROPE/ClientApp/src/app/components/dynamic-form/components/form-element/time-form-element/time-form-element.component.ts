import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

interface ScheduleTime {
  label: string;
  value: string;
}

@Component({
  selector: 'app-time-form-element',
  templateUrl: './time-form-element.component.html',
  styleUrl: './time-form-element.component.scss',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class TimeFormElementComponent {
  @Input()
  form: FormGroup;

  @Input()
  tempForm: FormGroupDirective;

  @Input() formElement: any;
  
  timeControl = new FormControl<string | null>(null);
  availableTimes: ScheduleTime[] = [];

  constructor() {
    this.generateTimeSlots();
  }

  generateTimeSlots(): void {
    const startHour = 8;
    const endHour = 18;
    const interval = 45;
    const times: ScheduleTime[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += interval) {
        const timeLabel = `${this.pad(hour)}:${this.pad(min)}`;
        times.push({ label: timeLabel, value: timeLabel });
      }
    }

    this.availableTimes = times;
  }

  private pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
