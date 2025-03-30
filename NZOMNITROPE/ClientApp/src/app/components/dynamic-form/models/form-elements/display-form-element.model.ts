import { FormElementType } from "../../enums/form-element-type.enum";
import { FormElement } from "./form-element.model";

export enum DisplayFormat {
  String,
  Html,
  Date,
}

interface IDisplayProps {
  label: string;
  data: any;
  format?: DisplayFormat;
}

export class DisplayFormElement extends FormElement {
  label: string;
  data: any;
  format?: DisplayFormat;

  constructor(props: IDisplayProps) {
    super();
    this.type = FormElementType.Display;
    this.label = props.label;
    this.data = props.data;
    this.format = props.format ?? DisplayFormat.String;
  }
}