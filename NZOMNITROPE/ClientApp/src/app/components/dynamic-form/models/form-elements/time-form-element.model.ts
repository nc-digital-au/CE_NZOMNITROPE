import { FormElementType } from "../../enums/form-element-type.enum";
import { FormInputElement, IFormInputProps } from "./form-input-element.model";

interface ITimeFormInputProps extends IFormInputProps {}

export class TimeFormInputElement extends FormInputElement {
  constructor(props: ITimeFormInputProps) {
    super(props);
    this.type = FormElementType.Time;
  }
}