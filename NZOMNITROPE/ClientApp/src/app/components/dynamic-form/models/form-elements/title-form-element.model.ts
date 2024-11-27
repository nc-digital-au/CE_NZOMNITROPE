import { FormElementType } from "../../enums/form-element-type.enum";
import { FormElement } from "./form-element.model";

interface ITitleProps {
  label: string;
}

export class TitleFormElement extends FormElement {
  label: string;

  constructor(props: ITitleProps) {
    super();
    this.type = FormElementType.Title;
    this.label = props.label;
  }
}