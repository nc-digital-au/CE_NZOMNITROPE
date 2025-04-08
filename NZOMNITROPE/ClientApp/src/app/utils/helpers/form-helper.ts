import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Title } from "../enums/ofev-data";
import { ContactInformation } from "src/app/components/contact-information/contact-information.model";
import { Address } from "../models/address.model";

export const shortTitleList : Title[] = [
  Title.Mr, Title.Mrs, Title.Ms, Title.Mx
]

export function stringifyCompare(a: any, b: any){
    return JSON.stringify(a) === JSON.stringify(b);
}

export function getErrorMessage(formGroup: FormGroup, formName: string, errorLabel: string){
  let formCtl = formGroup.get(formName);
  if(formCtl?.errors){
    if(formCtl.errors?.['required'])
      return `${errorLabel} is required`;

    if(formCtl.errors?.['startsWith'])
      return `${errorLabel} ${formCtl.errors?.['startsWith']}`;

    if(formCtl.errors?.['numbersOnly'])
      return `${errorLabel} must contain numbers only`;

    if(formCtl.errors?.['maxlength'])
      return `${errorLabel} is too long`;

    if(formCtl.errors?.['minlength'])
      return `${errorLabel} is too short`;

    if(formCtl.errors?.['requiredLength'])
      return `${errorLabel} ${formCtl.errors?.['requiredLength']}`;
    
    if(formCtl.errors?.['email'])
      return `Entered value is not a valid email`;

    if(formCtl.errors?.['phone'])
      return `${errorLabel} ${formCtl.errors?.['phone']}`;

    if(formCtl.errors?.['mobile'])
      return `${errorLabel} ${formCtl.errors?.['mobile']}`;

    if(formCtl.errors?.['minAge'])
      return `${formCtl.errors?.['minAge']}`;

    if (formCtl.errors?.['invalidNHI'])
      return `${errorLabel} must be a valid NHI number (e.g. ABC1234)`;    

    if (formCtl.errors?.['passwordMismatch'])
      return `Passwords do not match`;    

    if(formCtl.errors?.['custom'])
      return `${errorLabel} ${formCtl.errors?.['custom']}`;

    return `undefined error for ${formCtl.errors?.[0]}`;
  }

  return '';
}

export function removeRequiredValidation(controls: FormControl[]){
  controls.forEach(control => {
    if(control.hasValidator(Validators.required))
      {
        control.removeValidators(Validators.required);
        control.updateValueAndValidity();
      }
  });
}

export function addRequiredValidation(controls: FormControl[]){
  controls.forEach(control => {
    if(!control.hasValidator(Validators.required))
      {
        control.addValidators(Validators.required);
        control.updateValueAndValidity();
      }
  });
  
}

export function contactNumberToString(contact: ContactInformation){
  if(contact.phone && contact.mobile)
    return `P: ${contact.phone}, M: ${contact.mobile}`;

  return contact.phone ? contact.phone : contact.mobile;
}

export function deliveryAddressToString(address: Address){
let streetAddress = `${address.streetAddress} ${address.city} ${address.postcode} ${address.addressState}`;
return address.unitNumber ? `${address.unitNumber} ${streetAddress}` : streetAddress;
}

export interface PdfFormData{
  label: string;
  data: string;
}