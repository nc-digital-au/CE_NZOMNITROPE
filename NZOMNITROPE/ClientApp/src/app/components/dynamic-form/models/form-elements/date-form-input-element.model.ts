import { FormElementType } from "../../enums/form-element-type.enum";
import { IFormValidation } from "../../interfaces/form-validation.interface";
import { FormInputElement, IFormInputProps } from "./form-input-element.model";

interface IDateFormInputValidation extends IFormValidation {
  age?: number;
}

interface IDateFormInputProps extends IFormInputProps {
  validation?: IDateFormInputValidation,
}

export class DateFormInputElement extends FormInputElement {
  constructor(props: IDateFormInputProps) {
    super(props);
    this.type = FormElementType.Date;
  }
}