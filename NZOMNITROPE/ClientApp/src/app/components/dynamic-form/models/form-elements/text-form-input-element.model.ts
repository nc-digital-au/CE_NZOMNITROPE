import { FormElementType } from "../../enums/form-element-type.enum";
import { IFormValidation } from "../../interfaces/form-validation.interface";
import { FormInputElement, IFormInputProps } from "./form-input-element.model";

interface ITextFormInputValidation extends IFormValidation {
  maxLength?: number;
  minLength?: number;
  requiredLength?: number;
  phone?: boolean;
  mobile?: boolean;
  email?: boolean;
  numbersOnly?: boolean;
  prescriberNumber?: boolean;
  password?: boolean;
  custom?: any[];
  customAsync?: any[];
  pattern?: string;
}

export interface ITextFormInputProps extends IFormInputProps {
  hint?: string;
  validation?: ITextFormInputValidation,
}

export class TextFormInputElement extends FormInputElement {
  hint?: string;
  override validation: ITextFormInputValidation;
  
  constructor(props: ITextFormInputProps) {
    super(props);
    this.type = FormElementType.Text;
    this.hint = props.hint;
  }
}