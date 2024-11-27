import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { MultilineTextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/multiline-text-form-input-element.model';
import { SelectFormInputElement, SelectOption } from 'src/app/components/dynamic-form/models/form-elements/select-form-input-element.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { LeavingSiteDialog } from 'src/app/components/leaving-site/leaving-site.component';
import { CONTACT_VALUES, UI_DEFAULTS } from 'src/app/utils/constants';
import { Dosage, DosageLabel, RepeatOptionLabel } from 'src/app/utils/enums/ofev-data';

@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
  ],
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss'
})
export class PrescriptionFormComponent implements AfterViewInit {
  @Output()
  formCreated = new EventEmitter<FormGroup>();

  formDefinition: DynamicForm;

  constructor(
    private _dialog: MatDialog,
  ) {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      document.getElementsByClassName("product-information")[0].addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this._dialog.open(LeavingSiteDialog, {
          data: {
            url: CONTACT_VALUES.PI_LINK,
          }
        })
      });
    });
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    const dosageOptions: SelectOption[] = [
      { label: DosageLabel.D100, value: Dosage.D100 },
      { label: DosageLabel.D150, value: Dosage.D150 },
    ];
    
    this.formDefinition = new DynamicForm(
      [
        new TitleFormElement({
          label: 'Recommended Prescription',
        }),
        new TextFormInputElement({
          name: 'drug',
          label: 'Drug name',
          value: "OFEV® (nintedanib)",
          disabled: true,
          hint: 'To review the Product Information for OFEV® (nintedanib) please click <a class="product-information" href="#product-information">here</a>.',
          validation: {
            maxLength: UI_DEFAULTS.TEXT_INPUT_LIMIT,
          },
        }),
        new SelectFormInputElement({
          name: 'dose',
          label: 'Dosage',
          options: dosageOptions,
          validation: {
            required: true,
          },
        }),
        new TextFormInputElement({
          name: 'repeats',
          label: 'Repeats',
          value: RepeatOptionLabel.Five,
          disabled: true,
        }),
        new MultilineTextFormInputElement({
          name: 'instructions',
          label: 'Additional instructions',
          placeholder: 'Please provide any additional instructions for your patient',
        }),
      ]
    );
  }
}