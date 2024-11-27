import { AbstractControl } from "@angular/forms";

export function ValidateMobile(control: AbstractControl){
    if(!control || control.value === undefined || control.value.length === 0){
        return null;
    }
        
    if (!control.value.startsWith('0')) {
        return { mobile: 'must start with 0'};
    }
    if(control.value.length !== 10){
        return { mobile: 'must have 10 digits'};
    }
    if(isNaN(control.value)){
        return { mobile: 'must contain only numbers'};
    }
    
    return null;
}