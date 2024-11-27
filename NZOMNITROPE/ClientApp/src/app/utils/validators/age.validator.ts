import { AbstractControl, ValidationErrors } from "@angular/forms";

export function ageValidator(value: number){
   return (control: AbstractControl) : ValidationErrors | null => {
        if(value === undefined || value === null || !control || control.value === undefined)
            return null;

        if(Object.prototype.toString.call(control.value) === '[object Date]')
        {
            const enteredDate = new Date(control.value.toString());
            const minYear = enteredDate.getFullYear() + value;
            let minDate = new Date(minYear, enteredDate.getMonth(), enteredDate.getDate());
            let currentDate = new Date();
            const comparisonDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            return comparisonDate < minDate ? {minAge: 'The mininum age requirement is ' + value } : null;

        }
        return null;
    }
}