import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable, finalize, map, tap } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  AddressState,
  ConsumableOrderItemDto,
  CreateOrderForConsumableProductsForPatientDto,
  DeliveryAddressType,
  GetPatientInformationWithCarerResponse,
  OrderServiceProxy,
  PatientServiceProxy,
} from 'src/app/services/service-proxies/service-proxies';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatStepper } from '@angular/material/stepper';
import { routeLinks } from 'src/app/utils/routes';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OrderFormComponent } from './order-form/order-form.component';
import { PatientFormComponent } from 'src/app/components/patient-form/patient-form.component';
import { environment } from 'src/environments/environment';
import { AddressWithAddressTypeComponent } from 'src/app/components/address-with-address-type/address-with-address-type.component';

function exactlyOneSelected(keys: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    if (!group || typeof (group as any).get !== 'function') return null;
    const values = keys.map(k => group.get(k)?.value);
    const count = values.filter(Boolean).length;
    return count === 1 ? null : { productSelection: 'Please select one option.' };
  };
}

@Component({
  selector: 'app-order-surepal-device',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    AddressWithAddressTypeComponent,
    PatientFormComponent,
    OrderFormComponent,
  ],
  templateUrl: './order-surepal-device.component.html',
  styleUrl: './order-surepal-device.component.scss',
})
export class OrderSurepalDeviceComponent {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(OrderFormComponent) orderFormComponent!: OrderFormComponent;

  destroyRef = inject(DestroyRef);
  stepperOrientation: Observable<StepperOrientation>;
  patientId: string;
  routeLinks = routeLinks;
  submitting = false;
  submitted = true;
  loading = true;
  orderSuccess = false;
  establishmentOnly = false;
  showAddressForm = true;
  _destroyRef = inject(DestroyRef);
  patientModel: GetPatientInformationWithCarerResponse;
  productsRequested: ConsumableOrderItemDto[] = [];

  patientForm = this._fb.group({});
  addressForm = this._fb.group({});
  orderForm = this._fb.group({});

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _patientService: PatientServiceProxy,
    private readonly _orderService: OrderServiceProxy,
    private readonly _authService: AuthenticationService,
    private readonly _router: Router
  ) {
    this.stepperOrientation = this._breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.getPatientInformation();
  }

  onOrderFormCreated(form: FormGroup) {
    this.orderForm = form;
    this.applyProductSelectionValidators();
    this.orderForm.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this.applyProductSelectionValidators());
  }

  private applyProductSelectionValidators(): void {
    if (!this.orderForm) return;

    const needleCtl = this.orderForm.get('needleKit');
    const penCtl = this.orderForm.get('penReplacement');

    if (!needleCtl || !penCtl) return;

    // Reset control-level validators
    needleCtl.removeValidators(Validators.required);
    penCtl.removeValidators(Validators.required);

    // Reset group-level validator then re-apply based on availability
    this.orderForm.setValidators(null);

    const needleAvail = needleCtl.enabled;
    const penAvail = penCtl.enabled;

    if (needleAvail && penAvail) {
      // Both visible/available: exactly one must be chosen
      this.orderForm.addValidators(exactlyOneSelected(['needleKit', 'penReplacement']));
    } else if (penAvail) {
      // Only pen available: require it
      penCtl.addValidators(Validators.required);
    } else if (needleAvail) {
      // Only needle available: require it
      needleCtl.addValidators(Validators.required);
    }

    needleCtl.updateValueAndValidity({ emitEvent: false });
    penCtl.updateValueAndValidity({ emitEvent: false });
    this.orderForm.updateValueAndValidity({ emitEvent: false });
  }

  private hasAnyProductSelected(): boolean {
    const v = this.orderForm?.value as any;
    return !!(v?.needleKit || v?.penReplacement);
  }

  onEstablishmentOnlyChange(event: any): void {
    this.establishmentOnly = event.value;
    this.showAddressForm = false;
    setTimeout(() => (this.showAddressForm = true), 0);
  }

  getAddressPatchData(): any {
    if (!this.patientModel) return {};
    return this.establishmentOnly
      ? {
          name: this.patientModel.deliveryBusinessName,
          unitNumber: this.patientModel.deliveryUnitNumber,
          streetAddress: this.patientModel.deliveryStreetAddress,
          city: this.patientModel.deliveryCity,
          postcode: this.patientModel.deliveryPostcode,
        }
      : {
          streetAddress: this.patientModel.deliveryStreetAddress,
          city: this.patientModel.deliveryCity,
          postcode: this.patientModel.deliveryPostcode,
        };
  }

  private getPatientInformation(): void {
    this._patientService
      .getPatientInformationWithCarer()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((response) => {
          if (response.isSuccess) {
            this.patientModel = response.resultObject;
            this.establishmentOnly =
              this.patientModel.deliveryAddressType ===
              DeliveryAddressType.BusinessAddress;
            this.updatePatientForm(this.patientModel);
            this.updateAddressForm(this.patientModel);
          }
        })
      )
      .subscribe({
        next: (result) => {
          if (result.isSuccess) {
            this.patientModel = result.resultObject;
            this.loading = false;
            if (this.orderForm) this.applyProductSelectionValidators();
          }
        },
        error: (error) => {
          console.error('Error fetching patient information:', error);
        },
      });
  }

  private updatePatientForm(data: GetPatientInformationWithCarerResponse): void {
    const patientFormData = {
      firstName: data.firstName,
      lastName: data.lastName,
      nhiNumber: data.nationalHealthIndex,
      email: data.email,
      mobile: data.mobileNumber,
    };
    this.patientForm.patchValue(patientFormData);
  }

  private updateAddressForm(data: GetPatientInformationWithCarerResponse): void {
    const addressFormData = {
      name: data.deliveryBusinessName,
      unitNumber: data.deliveryUnitNumber,
      streetAddress: data.deliveryStreetAddress,
      city: data.deliveryCity,
      postcode: data.deliveryPostcode,
    };
    this.addressForm.patchValue(addressFormData);
  }

  onPatientFormNext(): void {
    this.patientForm.markAllAsTouched();
    this.addressForm.markAllAsTouched();
    if (this.patientForm.valid) {
      this.stepper.next();
    }
  }

  private createOrderFormDto(): CreateOrderForConsumableProductsForPatientDto {
    const patientFormData = this.patientForm.value as any;
    const addressFormData = this.addressForm.value as any;
    this.GetOrderProducts();
    const adminNotificationEmail = environment.orderAdminEmail;

    const deliveryType = this.establishmentOnly
      ? DeliveryAddressType.BusinessAddress
      : DeliveryAddressType.PrivateAddress;

    return new CreateOrderForConsumableProductsForPatientDto({
      patientId: this.patientModel.patientId,
      firstName: patientFormData.firstName,
      lastName: patientFormData.lastName,
      email: this.patientModel.email,
      mobile: patientFormData.mobileNumber,
      patientReferenceNumber: patientFormData.nhiNumber,
      deliveryAddressType: deliveryType,
      deliveryInstitutionName: addressFormData.name,
      deliveryUnitNumber: addressFormData.unitNumber,
      deliveryStreetAddress: addressFormData.streetAddress,
      deliveryCity: addressFormData.city,
      deliveryPostCode: addressFormData.postcode,
      deliveryState: AddressState.NA,
      deliverTo: undefined,
      consumableOrderItems: this.productsRequested,
      adminNotificationEmail: adminNotificationEmail,
    });
  }

  onFormSubmit(): void {
    this.orderForm.markAllAsTouched();
    this.applyProductSelectionValidators();

    // FINAL GUARD: block submit if no product picked (covers any edge-case)
    if (!this.hasAnyProductSelected()) {
      const current = this.orderForm.errors || {};
      this.orderForm.setErrors({ ...current, productSelection: 'Please select one option.' });
      return;
    } else {
      // clear form-level selection error if user has fixed it
      const { productSelection, ...rest } = this.orderForm.errors || {};
      this.orderForm.setErrors(Object.keys(rest).length ? rest : null);
    }

    if (
      this.patientForm.valid &&
      this.addressForm.valid &&
      this.orderForm.valid
    ) {
      this.submitting = true;
      const orderDto = this.createOrderFormDto();
      this._orderService
        .createOrderForPatient(orderDto)
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          finalize(() => {
            this.submitting = false;
            this.submitted = true;
          })
        )
        .subscribe({
          next: (result) => {
            if (result.isSuccess) {
              this.orderSuccess = result.isSuccess;
            } else {
              console.error('Error updating patient profile', result);
            }
          },
          error: (err) => {
            console.error('Error updating patient profile', err);
          },
        });
    }
  }

  private GetOrderProducts(): void {
    this.productsRequested = [];
    const orderFormData = this.orderForm.value as any;
    if (orderFormData.needleKit) {
      this.productsRequested.push(
        new ConsumableOrderItemDto({ productId: undefined, sku: orderFormData.needleKit, quantity: 1 })
      );
    }
    if (orderFormData.penReplacement) {
      this.productsRequested.push(
        new ConsumableOrderItemDto({ productId: undefined, sku: orderFormData.penReplacement, quantity: 1 })
      );
    }
  }
}
