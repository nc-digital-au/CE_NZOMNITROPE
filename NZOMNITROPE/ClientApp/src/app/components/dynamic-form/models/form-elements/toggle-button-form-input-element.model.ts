import { FormElementType } from "../../enums/form-element-type.enum";
import { FormInputElement, IFormInputProps } from "./form-input-element.model";

export class ToggleButtonOption {
  label: string;
  value: any;
}

interface IToggleButtonFormInputProps extends IFormInputProps {
  options: ToggleButtonOption[];
}

export class ToggleButtonFormInputElement extends FormInputElement {
  options: ToggleButtonOption[] = [];

  constructor(props: IToggleButtonFormInputProps) {
    super(props);
    this.type = FormElementType.ToggleButton;
    this.options = props.options;
  }
}