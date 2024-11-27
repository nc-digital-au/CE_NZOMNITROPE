import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const equalValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (control && control.parent) {
    const keys = Object.keys(control.parent.controls);
    for (const key of keys) {
      const subControl: AbstractControl = control.parent.controls[key];
      if (control !== subControl && subControl.hasValidator(equalValidator)) {
        if (subControl.value) {
          if (control.value !== subControl.value) {
            const keySplits = key.replace(/([A-Z])/g, ' $1');
            const subControlLabel = keySplits.charAt(0).toUpperCase() + keySplits.slice(1).toLowerCase();
            return { custom: `and ${subControlLabel} does not match` };
          } else {
            subControl.setErrors(null);
          }
        }
      }
    }
  }
  return null;
};