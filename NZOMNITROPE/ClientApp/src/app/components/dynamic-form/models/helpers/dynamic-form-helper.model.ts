import { SelectOption } from "../form-elements/select-form-input-element.model";

export class DynamicFormHelper {
  static enumToSelectOptions(enumToTransform: any, enumLabel: any): SelectOption[] {
    const options: SelectOption[] = [];
    Object.keys(enumToTransform).filter(key => isNaN(Number(key))).forEach((key, i) => {
      options.push({
        label: enumLabel[enumToTransform[key]],
        value: enumToTransform[key],
      });
    });
    return options;
  }

  static formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    let sDd = dd.toString();
    let sMm = mm.toString();
    if (dd < 10) {
      sDd = `0${sDd}`;
    };
    if (mm < 10) {
      sMm = `0${sMm}`;
    }

    return `${sDd}/${sMm}/${yyyy}`;
  }
}