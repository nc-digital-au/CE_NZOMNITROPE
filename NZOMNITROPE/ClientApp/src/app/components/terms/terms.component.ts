import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CONTACT_VALUES } from 'src/app/utils/constants';
import { LeavingSiteComponent } from '../leaving-site/leaving-site.component';
import { EligibilityCriteriaDialogComponent } from 'src/app/pages/patient/eligibility-criteria/eligibility-criteria-dialog/eligibility-criteria-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    LeavingSiteComponent,
    EligibilityCriteriaDialogComponent
  ],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss',
  viewProviders:[
    {
      provide: ControlContainer,
      useFactory:() => inject(ControlContainer, {skipSelf: true})
    }
  ],
})
export class TermsComponent {
  @Input({required:true}) controlKey = '';
  @Input({required:true}) submitted = false;
  @Input() submitAll = false;

  contactValues = CONTACT_VALUES;

  parentContainer = inject(ControlContainer);
  get parentFormGroup(){
    return this.parentContainer.control as FormGroup;
  }

  terms = this.fb.nonNullable.group({
    checkOne: [<boolean|null>null, [Validators.requiredTrue]],
    checkTwo: [<boolean|null>null, [Validators.requiredTrue]],
    checkThree: [<boolean|null>null, [Validators.requiredTrue]],
    checkFour: [<boolean|null>null, [Validators.requiredTrue]],
  })

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ){}

  ngOnInit(){
    this.parentFormGroup.addControl(this.controlKey, this.terms);
    if(this.submitAll){
      this.terms.setValue({
        checkOne: true,
        checkTwo: true,
        checkThree: true,
        checkFour: true
      });
    }
  }

  ngOnDestroy(){
    this.parentFormGroup.removeControl(this.controlKey);
  }

  openEligibilityCriteria(){
    this.dialog.open(EligibilityCriteriaDialogComponent);
  }
  
  get checkOne(){
    return this.terms.controls.checkOne;
  }
  get checkTwo(){
    return this.terms.controls.checkTwo;
  }
  get checkThree(){
    return this.terms.controls.checkThree;
  }
  get checkFour(){
    return this.terms.controls.checkFour;
  }

}
