import { FormElementType } from "../../enums/form-element-type.enum";
import { IFormValidation } from "../../interfaces/form-validation.interface";
import { FormInputElement, IFormInputProps } from "./form-input-element.model";

interface ITimeFormInputValidation extends IFormValidation {
  minTime?: string;
  maxTime?: string;
  interval?: string;
}

export interface ITimeFormInputProps extends IFormInputProps {
  placeholder?: string;
  validation?: ITimeFormInputValidation;
}

export class TimeFormInputElement extends FormInputElement {
  constructor(props: ITimeFormInputProps) {
    super(props);
    this.type = FormElementType.Time;
  }
}
