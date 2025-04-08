import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validateNHI(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.toUpperCase().trim();
  const pattern = /^[A-Z]{3}[0-9]{4}$/;

  if (!value) return null;

  return pattern.test(value) ? null : { invalidNHI: 'Invalid NHI format. Use 3 letters followed by 4 digits (e.g. ABC1234).' };
}
