import { AbstractControl } from "@angular/forms";

export function ValidatePhone(control: AbstractControl){
    if(!control || control.value === undefined || control.value.length === 0){
        return null;
    }
    if (!control.value.startsWith('0')) {
        return { phone: 'must include an area code'};
    }
    if(control.value.length < 9 || control.value.length > 10){
        return { phone: 'must have 9 or 10 digits'};
    }
    if(isNaN(control.value)){
        return { phone: 'must contain only numbers'};
    }
    
    return null;
}