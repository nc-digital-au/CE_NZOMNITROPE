import { AbstractControl, ValidationErrors } from "@angular/forms";

export function startsWithValidator(value: string){
   return (control: AbstractControl) : ValidationErrors | null => {
        if(value === undefined || value === null)
            return null;
        return !control.value.startsWith(value) ? {startsWith: 'must start with ' + value} : null;
    }
}