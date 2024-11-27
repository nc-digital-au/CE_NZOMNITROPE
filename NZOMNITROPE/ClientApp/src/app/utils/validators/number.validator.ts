import { AbstractControl } from "@angular/forms";

export function numbersOnly(control: AbstractControl){
    if(!control || control.value === undefined){
        return null;
    }
    return isNaN(control.value) ? {numbersOnly: true} : null;
}