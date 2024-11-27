import { FormElementType } from "../../enums/form-element-type.enum";
import { FormElement } from "./form-element.model";

interface IDisplayProps {
  label: string;
  data: string;
}

export class DisplayFormElement extends FormElement {
  label: string;
  data: string;

  constructor(props: IDisplayProps) {
    super();
    this.type = FormElementType.Display;
    this.label = props.label;
    this.data = props.data;
  }
}