import { FormElementType } from "../../enums/form-element-type.enum";
import { FormInputElement, IFormInputProps } from "./form-input-element.model";

export class SelectOption {
  label: string;
  value: any;
}

interface ISelectFormInputProps extends IFormInputProps {
  options: SelectOption[];
}

export class SelectFormInputElement extends FormInputElement {
  options: SelectOption[] = [];

  constructor(props: ISelectFormInputProps) {
    super(props);
    this.type = FormElementType.Select;
    this.options = props.options;
  }
}