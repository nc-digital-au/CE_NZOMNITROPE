import { AbstractControl } from '@angular/forms';

export function ValidateMobile(control: AbstractControl) {
  const raw = (control?.value ?? '').toString().trim();

  if (!raw) return null;

  if (!/^\d+$/.test(raw)) {
    return { mobile: 'must contain only numbers' };
  }

  if (!raw.startsWith('0')) {
    return { mobile: 'must start with 0' };
  }

  if (raw.length < 9 || raw.length > 10) {
    return { mobile: 'must have 9–10 digits' };
  }

  return null;
}
