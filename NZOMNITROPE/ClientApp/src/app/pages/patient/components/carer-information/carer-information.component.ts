import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactInformationComponent } from 'src/app/components/contact-information/contact-information.component';
import { MaterialModule } from 'src/app/material.module';
import { UI_DEFAULTS } from 'src/app/utils/constants';
import { Title } from 'src/app/utils/enums/ofev-data';
import { getErrorMessage } from 'src/app/utils/helpers/form-helper';
import { Carer } from '../../patient.model';

@Component({
  selector: 'app-carer-information',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './carer-information.component.html',
  styleUrl: './carer-information.component.scss',
  viewProviders:[
    {
      provide: ControlContainer,
      useFactory:() => inject(ControlContainer, {skipSelf: true})
    }
  ],
})
export class CarerInformationComponent {
    @Input({required:true}) controlKey = '';
    @Input({required:true}) submitted = false;
    @Input() carer?: Carer; 

    uiDefaults = UI_DEFAULTS;
    titleOptions: Title[] = [
      Title.Mr, Title.Mrs, Title.Ms, Title.Mx
    ];

    parentContainer = inject(ControlContainer);
    get parentFormGroup(){
      return this.parentContainer.control as FormGroup;
    }

    carerInformation = this.fb.group({
      title: [<Title | null> null],
      firstName: ['',[Validators.maxLength(this.uiDefaults.TEXT_INPUT_LIMIT)]],
      lastName: ['', [Validators.maxLength(this.uiDefaults.TEXT_INPUT_LIMIT)]],
    })

    constructor(private fb: FormBuilder){}

    ngOnInit(){
      this.parentFormGroup.addControl(this.controlKey, this.carerInformation);
      if(this.carer)
      {
        this.carerInformation.patchValue(this.carer);
      }
    }

    ngOnDestroy(){
      this.parentFormGroup.removeControl(this.controlKey);
    }

    setErrorMessage = (formName: string, errorLabel: string) => getErrorMessage(this.carerInformation, formName, errorLabel);

}
