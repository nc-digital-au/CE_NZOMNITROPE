import { FormElementType } from "../../enums/form-element-type.enum";
import { IParentElement } from "../../interfaces/parent-element.interface";
import { FormElement } from "./form-element.model";

interface GroupFormElementOptions {
  requireAtLeastOne?: boolean;
  requireAtLeastOneMessage?: string;
}

interface IGroupProps {
  children: FormElement[];
  options?: GroupFormElementOptions;
}

export class GroupFormElement extends FormElement implements IParentElement {
  children: FormElement[];
  options?: GroupFormElementOptions;

  constructor(props: IGroupProps) {
    super();
    this.type = FormElementType.Group;
    this.children = props.children;
    this.options = props.options;
  }
}