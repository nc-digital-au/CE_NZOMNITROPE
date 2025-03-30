import { DestroyRef, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { getErrorMessage } from "src/app/utils/helpers/form-helper";

export abstract class DynamicFormComponentBase {
  protected _destroyRef = inject(DestroyRef);

  setErrorMessage = (form: FormGroup, control: string, errorLabel: string) => getErrorMessage(form, control, errorLabel);
}