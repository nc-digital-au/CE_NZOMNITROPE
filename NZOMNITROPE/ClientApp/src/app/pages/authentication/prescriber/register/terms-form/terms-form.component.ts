import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { CheckboxFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/checkbox-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { LeavingSiteDialog } from 'src/app/components/leaving-site/leaving-site.component';
import { TermsOfUseComponent } from 'src/app/components/terms-of-use/terms-of-use.component';

@Component({
  selector: 'app-terms-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
  ],
  templateUrl: './terms-form.component.html',
  styleUrl: './terms-form.component.scss'
})
export class TermsFormComponent implements AfterViewInit {
  @Output()
  formCreated = new EventEmitter<FormGroup>();

  profileFormDefinition: DynamicForm;

  constructor(
    private _dialog: MatDialog,
  ) {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      document.getElementsByClassName("terms-of-use")[0].addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this._dialog.open(TermsOfUseComponent);
      });
      
      document.getElementsByClassName("privacy-policy")[0].addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this._dialog.open(LeavingSiteDialog, {
          data: {
            url: 'https://www.boehringer-ingelheim.com/au/data-privacy',
          }
        })
      });
    });
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    this.profileFormDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'Agree to terms',
      }),
      new CheckboxFormInputElement({
        name: 'programTerms',
        label: 'I have read and agree to the <a id="terms-of-use" class="terms-of-use" href="#terms-of-use">Program Terms of Use</a>.',
        errorLabel: 'Program Terms of Use acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'privacyConsent',
        label: 'As a healthcare professional participating in this activity sponsored by Boehringer Ingelheim Pty Ltd, I have read and understood the <a class="privacy-policy" href="https://www.boehringer-ingelheim.com/au/data-privacy">privacy policy</a> and I agree with it.',
        errorLabel: 'Privacy Policy acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'adverseEventContactConsent',
        label: 'I agree that my participation indicates my consent for Boehringer Ingelheim patient safety department to contact me for further information regarding any adverse event identified as part of this activity.',
        errorLabel: 'Contact acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'contactConsent',
        label: 'I consent to the Program Administrator providing information to Boehringer Ingelheim through this Program.',
        errorLabel: 'Information sharing acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'marketingCommunicationConsent',
        label: 'I consent to receiving marketing communications from Boehringer Ingelheim (optional).',
      }),
    ]);
  }
}
