import { FormElementType } from "../../enums/form-element-type.enum";
import { IFormValidation } from "../../interfaces/form-validation.interface";
import { FormInputElement, IFormInputProps } from "./form-input-element.model";

interface ITimeFormInputValidation extends IFormValidation {
  minTime?: string;
  maxTime?: string;
  interval?: number;
  required?: boolean;
}

export interface ITimeFormInputProps extends IFormInputProps {
  placeholder?: string;
  validation?: ITimeFormInputValidation;
}

export class TimeFormInputElement extends FormInputElement {
  placeholder?: string;
  override validation: ITimeFormInputValidation;

  constructor(props: ITimeFormInputProps) {
    super(props);
    this.type = FormElementType.Time;
    this.placeholder = props.placeholder;
    this.validation = props.validation || {};
  }
}
