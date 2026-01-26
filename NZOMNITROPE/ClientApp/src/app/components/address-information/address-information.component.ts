import { NgxGpAutocompleteDirective, NgxGpAutocompleteModule, NgxGpAutocompleteOptions } from '@angular-magic/ngx-gp-autocomplete';
import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';

import { MaterialModule } from 'src/app/material.module';
import { AddressState } from 'src/app/utils/enums/ofev-data';
import { getErrorMessage } from 'src/app/utils/helpers/form-helper';
import { requiredLength } from 'src/app/utils/validators/required-length.validator';

@Component({
  selector: 'app-address-information',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxGpAutocompleteModule,
  ],
  providers:[
    {
      provide: Loader,
      useValue: new Loader({
        apiKey: environment.googleApiKey,
        libraries: ['places']
      })
    },
  ],
  templateUrl: './address-information.component.html',
  styleUrl: './address-information.component.scss',
  viewProviders:[
    {
      provide: ControlContainer,
      useFactory:() => inject(ControlContainer, {skipSelf: true})
    },
  ],
})
export class AddressInformationComponent {

  @ViewChild('ngxPlaces') placesRef: NgxGpAutocompleteDirective;
  @Input({required:true}) controlKey = '';
  @Input() addressType: string;

  parentContainer = inject(ControlContainer);
  get parentFormGroup(){
    return this.parentContainer.control as FormGroup;
  }

  options: NgxGpAutocompleteOptions = {
    componentRestrictions: { country: ['au'] },
    fields:['address_components', 'geometry'],
    types:['address']
  };
  eAddressState = AddressState;

  address = this.fb.nonNullable.group({
    unitNumber: ['', Validators.maxLength(25)],
    streetAddress: ['', [Validators.required, Validators.maxLength(100)]],
    city: ['', [Validators.required, Validators.maxLength(50)]],
    addressState: [<AddressState | null> null, Validators.required],
    postcode: ['', [Validators.required, requiredLength(4)] ],
    addressType: 'business',
  })

  constructor(private fb: FormBuilder){

  }

  ngOnInit(){
    this.parentFormGroup.addControl(this.controlKey, this.address);
  }

  ngOnDestroy(){
    this.parentFormGroup.removeControl(this.controlKey);
  }

  public handleAddressChange(place: google.maps.places.PlaceResult) {
    let streetNumber = '';
    let streetRoute = '';
    for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
      const componentType = component.types[0];
      switch (componentType) {
        case "street_number": {
          streetNumber = component.long_name;
          break;
        }
        case "route": {
          streetRoute = component.short_name;
          break;
        }
        case "postal_code": {
          this.postcode.setValue(component.long_name);
          break;
        }

        case "locality":
          this.city.setValue(component.long_name);
          break;

        case "administrative_area_level_1": {
          this.addressState.setValue(AddressState[component.short_name as keyof typeof AddressState]);
          break;
        }
      }
    }
    this.streetAddress.setValue(`${streetNumber} ${streetRoute}`);
  }

  setErrorMessage = (formName: string, errorLabel: string) => getErrorMessage(this.address, formName, errorLabel);

  get streetAddress(){
    return this.address.controls.streetAddress;
  }

  get city(){
    return this.address.controls.city;
  }

  get postcode(){
    return this.address.controls.postcode;
  }

  get addressState(){
    return this.address.controls.addressState;
  }
}
