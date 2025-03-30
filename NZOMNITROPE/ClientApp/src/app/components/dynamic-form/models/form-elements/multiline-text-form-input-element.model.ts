import { FormElementType } from "../../enums/form-element-type.enum";
import { IFormValidation } from "../../interfaces/form-validation.interface";
import { IFormInputProps } from "./form-input-element.model";
import { TextFormInputElement } from "./text-form-input-element.model";

interface IMultilineTextFormInputValidation extends IFormValidation {
  maxLength?: number;
}

interface IMultilineTextFormInputProps extends IFormInputProps {
  validation?: IMultilineTextFormInputValidation,
  rows?: number;
  placeholder?: string;
}

export class MultilineTextFormInputElement extends TextFormInputElement {
  rows: number;
  placeholder: string | undefined;

  constructor(props: IMultilineTextFormInputProps) {
    super(props);
    this.type = FormElementType.MultilineText;
    this.rows = props.rows ?? 5;
    this.placeholder = props.placeholder;
  }
}