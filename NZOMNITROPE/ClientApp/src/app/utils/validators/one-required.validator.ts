import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function oneRequired(keys: string[]): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
        return keys.some((key) => form.get(key) && form.get(key)?.value) ? null : { oneRequired : true };
    }
}
