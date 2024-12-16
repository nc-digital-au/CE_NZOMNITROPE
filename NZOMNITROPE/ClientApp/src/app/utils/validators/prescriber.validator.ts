import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { PrescriberServiceProxy, RegistrationServiceProxy } from 'src/app/services/service-proxies/service-proxies';

export class PrescriberValidator {
  static PRESCRIBER_NUMBER_MAX_LENGTH = 6;

  static ahpraNumberUnique(registrationService: RegistrationServiceProxy): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      if (control.value) {
        return registrationService
          .checkAhpraNumberAvailability(control.value)
          .pipe(
            map(result =>
              !result?.resultObject ? { custom: 'is not available' } : null
            )
          );
      }

      return of(null);
    };
  }
  
  static ahpraNumberFormat(control: AbstractControl): ValidationErrors {
    if (control.value) {
      const format = /^(\w{3})(\d{6,10})/;
      return !format.test(control.value) ? { custom: 'format is invalid' } : null;
    }

    return null;
  }

  static prescriberNumberUnique(prescriberService: PrescriberServiceProxy): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      if (control.value) {
        return prescriberService
          .availability(control.value)
          .pipe(
            map(result =>
              !result?.resultObject ? { custom: 'is not available' } : null
            )
          );
      }
      return of(null);
    };
  }

  static nihNumberFormat(control: AbstractControl): ValidationErrors {
    if (control.value) {
      const format = /^[A-Z]{3}\d{4}$/;
      return !format.test(control.value) ? { custom: 'format is invalid' } : null;
    }
    return null;
  }

  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const passwordFormat = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=]).{8,}$/;
      return !passwordFormat.test(control.value) ? { custom: 'must be at least 8 characters, with uppercase, lowercase, number, and symbol' } : null;
    }
    return null;
  }
  
  static matchPasswords(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.root) {
      const password = control.root.get('password');
      if (password && control.value !== password.value) {
        return { custom: 'must match to the password' };
      }
    }
    return null;
  }
}


