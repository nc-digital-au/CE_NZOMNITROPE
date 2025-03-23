import { IParentElement } from "../interfaces/parent-element.interface";
import { FormElement } from "./form-elements/form-element.model";

export class DynamicForm implements IParentElement {
  children: FormElement[];

  constructor(
    children: FormElement[]  = [],
  ) {
    this.children = children;
  }
}
