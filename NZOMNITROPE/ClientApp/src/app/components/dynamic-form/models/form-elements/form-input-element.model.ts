import { IFormValidation } from '../../interfaces/form-validation.interface';
import { FormElement } from './form-element.model';

export interface IFormInputProps {
  name: string;
  label: string;
  validation?: IFormValidation;
  value?: any;
  disabled?: boolean;
  hidden?: boolean;
  errorLabel?: string;
  hideErrors?: boolean;
  [key: string]: any;
}

export abstract class FormInputElement extends FormElement {
  name: string;
  label: string;
  validation: IFormValidation | undefined;
  value: any;
  disabled: boolean | undefined;
  hidden: boolean | undefined;
  errorLabel: string;
  hideErrors: boolean | undefined;

  constructor(
    props: IFormInputProps,
  ) {
    super();
    this.name = props.name;
    this.label = props.label;
    this.validation = props.validation;
    this.value = props.value;
    this.disabled = props.disabled;
    this.hidden = props.hidden;
    this.errorLabel = props.errorLabel ?? props.label;
    this.hideErrors = props.hideErrors;
  }
}
