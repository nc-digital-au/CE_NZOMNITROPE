import { AbstractControl, ValidationErrors } from "@angular/forms";

export function requiredLength(value: number){
   return (control: AbstractControl) : ValidationErrors | null => {
        if(value === undefined || value === null || !control || control.value === undefined)
            return null;
        let itemType = 'numbers';
        if(isNaN(control.value))
            itemType = 'characters';
        return control.value.length !== value ? { requiredLength: 'must contain ' + value + ' ' + itemType } : null;
    }
}