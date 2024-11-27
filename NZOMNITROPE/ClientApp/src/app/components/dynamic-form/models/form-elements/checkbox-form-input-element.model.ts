import { FormElementType } from "../../enums/form-element-type.enum";
import { IFormInputProps, FormInputElement } from "./form-input-element.model";

export class CheckboxFormInputElement extends FormInputElement {
  constructor(props: IFormInputProps) {
    super(props);
    this.type = FormElementType.Checkbox;
  }
}