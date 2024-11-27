import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
import { ValidationProblemDetail } from 'src/app/interceptors/error.interceptor';
import { AccountServiceProxy, ForgotPasswordDto } from 'src/app/services/service-proxies/service-proxies';
import { routeLinks } from 'src/app/utils/routes';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatButton,
    RouterLink,
    DynamicFormComponent,
    InlineAlertComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  routeLinks = routeLinks;
  formDefinition: DynamicForm;
  destroyRef = inject(DestroyRef);
  formSubmitted = false;
  isSuccess = true;
  responseProblem: ValidationProblemDetail;

  form = this._fb.group({});

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _accountService: AccountServiceProxy,
  ) {
    this.buildForm();
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value as any;
      this._accountService.forgotPassword(new ForgotPasswordDto({ email: formValue.email }))
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            this.formSubmitted = true;
          }),
        )
        .subscribe({
          next: (response => {
            this.isSuccess = response.isSuccess;
          }),
          error: (err => {
            this.isSuccess = false;
            this.responseProblem = err.problemDetails;
          }),
        });
    }
  }

  private buildForm(): void {
    this.formDefinition = new DynamicForm([
      new TextFormInputElement({
        name: 'email',
        label: 'Email',
        validation: {
          required: true,
          email: true,
        },
      }),
    ]);
  }
}
