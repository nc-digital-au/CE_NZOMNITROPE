import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable, finalize, map, tap } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AddressComponent } from "../../../components/address/address.component";
import { AddressState, ConsumableOrderItemDto, CreateOrderForConsumableProductsForPatientDto, GetPatientInformationWithCarerResponse, OrderServiceProxy, PatientServiceProxy } from 'src/app/services/service-proxies/service-proxies';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatStepper } from '@angular/material/stepper';
import { routeLinks } from 'src/app/utils/routes';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OrderFormComponent } from './order-form/order-form.component';
import { PatientFormComponent } from 'src/app/components/patient-form/patient-form.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-surepal-device',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    AddressComponent,
    PatientFormComponent,
    OrderFormComponent,
  ],
  templateUrl: './order-surepal-device.component.html',
  styleUrl: './order-surepal-device.component.scss'
})
export class OrderSurepalDeviceComponent {
  @ViewChild('stepper')
  stepper: MatStepper;

  @ViewChild(OrderFormComponent)
  orderFormComponent!: OrderFormComponent;

  destroyRef = inject(DestroyRef);
  stepperOrientation: Observable<StepperOrientation>;
  patientId: string;
  routeLinks = routeLinks;
  submitting = false;
  submitted = true;
  loading = true;
  orderSuccess: boolean = false;
  establishmentOnly = false;
  _destroyRef = inject(DestroyRef);
  patientModel: GetPatientInformationWithCarerResponse;
  productsRequested: ConsumableOrderItemDto[] = [];

  // forms
  patientForm = this._fb.group({});
  addressForm = this._fb.group({});
  orderForm = this._fb.group({});
  constructor(
    private readonly _fb: FormBuilder,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _patientService: PatientServiceProxy,
    private readonly _orderService: OrderServiceProxy,
    private readonly _authService: AuthenticationService,
    private readonly _router: Router,
  ) {
    this.stepperOrientation = this._breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.getPatientInformation();
  }

  onEstablishmentOnlyChange(event: any): void {
    this.establishmentOnly = event.value;
  }
  
  private getPatientInformation(): void {
    this._patientService.getPatientInformationWithCarer()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((response) => {
          if(response.isSuccess){
            this.patientModel = response.resultObject;
            this.updatePatientForm(this.patientModel);
            this.updateAddressForm(this.patientModel);
          }
        })
      )
      .subscribe({
        next: (result) => {
          if(result.isSuccess){
            this.patientModel = result.resultObject;
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Error fetching patient information:', error);
        }
      });
  }

  private updatePatientForm(data: GetPatientInformationWithCarerResponse): void {
    const patientFormData = {
      
      firstName: data.firstName,
      lastName: data.lastName,
      nhiNumber: data.nationalHealthIndex,
      email: data.email,
      mobile: data.mobileNumber
    }
    this.patientForm.patchValue(patientFormData);
  }

  private updateAddressForm(data: GetPatientInformationWithCarerResponse): void {
    const addressFormData = {
      name: data.deliveryBusinessName,
      unitNumber: data.deliveryUnitNumber,
      streetAddress: data.deliveryStreetAddress,
      city: data.deliveryCity,
      postcode: data.deliveryPostcode,
    }
    this.addressForm.patchValue(addressFormData);
  }

  onPatientFormNext() {
    const patientFormData = this.patientForm.value as any;
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
    const orderDto = new CreateOrderForConsumableProductsForPatientDto({
      patientId: this.patientModel.patientId,
      firstName: patientFormData.firstName,
      lastName: patientFormData.lastName,
      email: this.patientModel.email,
      mobile: this.patientModel.mobileNumber,
      patientReferenceNumber: this.patientModel.nationalHealthIndex,
      deliveryInstitutionName: addressFormData.name,
      deliveryUnitNumber: addressFormData.unitNumber,
      deliveryStreetAddress: addressFormData.streetAddress,
      deliveryCity: addressFormData.city,
      deliveryPostCode: addressFormData.postcode,
      deliveryState: AddressState.NA, 
      deliverTo: undefined,
      consumableOrderItems: this.productsRequested,
      adminNotificationEmail:adminNotificationEmail,
    });

  console.log('Order DTO:', orderDto);

  return orderDto;
  }

  onFormSubmit(): void {
   this.orderForm.markAllAsTouched();
  if (this.patientForm.valid && this.addressForm.valid && this.orderForm.valid) {
    this.submitting = true;
      const orderDto = this.createOrderFormDto();
      this._orderService.createOrderForPatient(orderDto)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
          finalize(() => {
            this.submitting = false;
            this.submitted = true;
      }),
      ).subscribe({
        next: (result) => {
          if(result.isSuccess){
            this.orderSuccess = result.isSuccess;
            this.submitting = false;
          }
          else{
            console.error('Error updating patient profile', result);
            this.submitting = false;
          } 
        },
        error: (err) => {
          console.error('Error updating patient profile', err);
          this.submitting = false;
        },
      });
    }
  }

  private GetOrderProducts(): void {
    const orderFormData = this.orderForm.value as any;
    if(orderFormData.needleKit){
      this.productsRequested.push(new ConsumableOrderItemDto({
        productId: undefined,
        sku: orderFormData.needleKit,
        quantity: 1
      }));
    }
    if(orderFormData.penReplacement){
      this.productsRequested.push(new ConsumableOrderItemDto({
        productId: undefined,
        sku: orderFormData.penReplacement,
        quantity: 1
      }));
    }
  }
}