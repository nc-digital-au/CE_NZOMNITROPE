import { Observable } from "rxjs";
import { FormElementType } from "../../enums/form-element-type.enum";
import { FormInputElement } from "./form-input-element.model";
import { ITextFormInputProps } from "./text-form-input-element.model";

export class AutocompleteOption {
  label: string;
  value: any;

  constructor(label: string, value: any) {
    this.label = label;
    this.value = value;
  }
}

interface IAutocompleteFormInputProps<TEntity, TDataEntity> extends ITextFormInputProps {
  valueLabel: string;
  optionSelected: (value: TDataEntity) => void
  method$: (filter?: string) => Observable<TEntity>;
}

export class AutocompleteFormInputElement<TEntity, TDataEntity> extends FormInputElement {
  valueLabel: string;
  optionSelected: (value: TDataEntity) => void;
  method$: (filter?: string) => Observable<TEntity>;

  constructor(props: IAutocompleteFormInputProps<TEntity, TDataEntity>) {
    super(props);
    this.type = FormElementType.Autocomplete;
    this.valueLabel = props.valueLabel;
    this.optionSelected = props.optionSelected;
    this.method$ = props.method$;
  }
}