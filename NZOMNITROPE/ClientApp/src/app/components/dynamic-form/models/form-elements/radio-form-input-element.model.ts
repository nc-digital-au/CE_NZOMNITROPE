import { FormElementType } from "../../enums/form-element-type.enum";
import { IFormInputProps, FormInputElement } from "./form-input-element.model";

export class RadioOption {
  label: string;
  value: any;
}

interface IRadioFormInputProps extends IFormInputProps {
  options: RadioOption[];
}

export class RadioFormInputElement extends FormInputElement {
  options: RadioOption[];

  constructor(props: IRadioFormInputProps) {
    super(props);
    this.type = FormElementType.Radio;
    this.options = props.options;
  }
}