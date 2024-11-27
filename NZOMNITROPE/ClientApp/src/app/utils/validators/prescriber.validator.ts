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
}