import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
import { ValidationProblemDetail } from 'src/app/interceptors/error.interceptor';
import { AccountServiceProxy, ResetPasswordDto, ResetPasswordWithoutAhpraDto } from 'src/app/services/service-proxies/service-proxies';
import { routeLinks } from 'src/app/utils/routes';
import { equalValidator } from 'src/app/utils/validators/equal.validator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    RouterLink,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardTitle,
    MatCardContent,
    MatButton,
    DynamicFormComponent,
    InlineAlertComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  formDefinition: DynamicForm;
  token: string;
  destroyRef = inject(DestroyRef);
  formSubmitted = false;
  isSuccess = true;
  responseProblem: ValidationProblemDetail;
  routeLinks = routeLinks;

  form: FormGroup<{}>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly _accountService: AccountServiceProxy,
  ) {

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(paramMap => {
      const token = paramMap.get('token');
      if (token) {
        this.token = token.replaceAll(' ', '+');
        this.buildForm();
      }
    });
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value as any;
      this._accountService.resetPasswordWithoutAhpra(new ResetPasswordWithoutAhpraDto({
        token: this.token,
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
      }))
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
      new TextFormInputElement({
        name: 'password',
        label: 'Password',
        validation: {
          required: true,
          password: true,
          minLength: 8,
          custom: [
            equalValidator,
          ],
        },
      }),
      new TextFormInputElement({
        name: 'confirmPassword',
        label: 'Confirm password',
        validation: {
          required: true,
          password: true,
          minLength: 8,
          custom: [
            equalValidator,
          ],
        },
      }),
    ]);
  }
}
