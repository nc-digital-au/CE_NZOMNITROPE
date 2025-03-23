import { GetDiscontinueReasonsResponse, GetPatientEligibilityCriteriaResponse } from "src/app/services/service-proxies/service-proxies";
import { RadioFormInputElement } from "../form-elements/radio-form-input-element.model";
import { SelectOption } from "../form-elements/select-form-input-element.model";

export class DynamicFormHelper {
  static enumToOptions(enumToTransform: any, enumLabel: any): SelectOption[] {
    const options: SelectOption[] = [];
    Object.keys(enumToTransform).filter(key => isNaN(Number(key))).forEach((key, i) => {
      options.push({
        label: enumLabel[enumToTransform[key]],
        value: enumToTransform[key],
      });
    });
    return options;
  }

  static criteriaToOptions(criteriaToTransform: GetPatientEligibilityCriteriaResponse[]): any[] {
    const options: any[] = [];
    criteriaToTransform.forEach(element => {
      options.push({
        label: element.optionDescription,
        value: element.id
      })
    });
    return options;
  }

  static discontinueReasonsToOptions(reasonsToTransform: GetDiscontinueReasonsResponse[]): any[] {
    const options: any[] = [];
    reasonsToTransform.forEach(element => {
      options.push({
        label: element.description,
        value: element.id
      })
    });
    return options;
  }

  static patientEligibilityToRadioButtonElements(criteriaToTransform: GetPatientEligibilityCriteriaResponse[]): RadioFormInputElement[] {
    const radioFormElements: RadioFormInputElement[] = [];
    const criteriaOptions: any[] = [
      {
        label: 'Yes',
        value: true,
      },
      {
        label: 'No',
        value: false,
      },
    ];
    criteriaToTransform.forEach(element => {
      radioFormElements.push(
        new RadioFormInputElement({
          name: element.optionName,
          label: element.optionDescription,
          options: criteriaOptions,
          validation: {
            required: element.optionCriteria,
            },
          })
      )
    });
    return radioFormElements;
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