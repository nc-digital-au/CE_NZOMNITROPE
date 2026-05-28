import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
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
export class AddressInformationComponent implements AfterViewInit {

  @ViewChild('placesContainer') placesContainer: ElementRef<HTMLDivElement>;
  @Input({required:true}) controlKey = '';
  @Input() addressType: string;

  parentContainer = inject(ControlContainer);
  get parentFormGroup(){
    return this.parentContainer.control as FormGroup;
  }

  eAddressState = AddressState;

  address = this.fb.nonNullable.group({
    unitNumber: ['', Validators.maxLength(25)],
    streetAddress: ['', [Validators.required, Validators.maxLength(100)]],
    city: ['', [Validators.required, Validators.maxLength(50)]],
    addressState: [<AddressState | null> null, Validators.required],
    postcode: ['', [Validators.required, requiredLength(4)] ],
    addressType: 'business',
  })

  constructor(private fb: FormBuilder, private loader: Loader){

  }

  ngOnInit(){
    this.parentFormGroup.addControl(this.controlKey, this.address);
  }

  ngAfterViewInit(): void {
    setTimeout(() => void this.initializePlaceAutocomplete(), 0);
  }

  ngOnDestroy(){
    this.parentFormGroup.removeControl(this.controlKey);
  }

  public handleAddressChange(place: google.maps.places.PlaceResult | any) {
    let streetNumber = '';
    let streetRoute = '';
    const addressComponents = place?.address_components ?? place?.addressComponents ?? [];
    for (const component of addressComponents) {
      const componentType = component.types[0];
      const longName = component.long_name ?? component.longText ?? '';
      const shortName = component.short_name ?? component.shortText ?? '';
      switch (componentType) {
        case "street_number": {
          streetNumber = longName;
          break;
        }
        case "route": {
          streetRoute = shortName;
          break;
        }
        case "postal_code": {
          this.postcode.setValue(longName);
          break;
        }

        case "locality":
          this.city.setValue(longName);
          break;

        case "administrative_area_level_1": {
          this.addressState.setValue(AddressState[shortName as keyof typeof AddressState]);
          break;
        }
      }
    }
    this.streetAddress.setValue(`${streetNumber} ${streetRoute}`);
  }

  private async initializePlaceAutocomplete(): Promise<void> {
    const host = this.placesContainer?.nativeElement;
    if (!host) {
      return;
    }

    const placesLibrary = await this.loader.load().then(() => google.maps.importLibrary('places'));
    const PlaceAutocompleteElementCtor =
      (placesLibrary as any)?.PlaceAutocompleteElement ??
      (google.maps.places as any)?.PlaceAutocompleteElement;

    if (!PlaceAutocompleteElementCtor) {
      return;
    }

    const autocompleteElement = new PlaceAutocompleteElementCtor({
      componentRestrictions: { country: ['au'] },
      types: ['address']
    });

    const onPlaceSelect = (event: Event) => {
      void this.handlePlaceSelection(event as CustomEvent);
    };

    autocompleteElement.addEventListener('gmp-placeselect', onPlaceSelect);
    autocompleteElement.addEventListener('gmp-select', onPlaceSelect);

    host.innerHTML = '';
    host.appendChild(autocompleteElement);
  }

  private async handlePlaceSelection(event: CustomEvent): Promise<void> {
    const prediction = (event as any)?.placePrediction ?? event?.detail?.placePrediction;
    if (!prediction?.toPlace) {
      return;
    }

    const place = prediction.toPlace();
    if (place?.fetchFields) {
      await place.fetchFields({ fields: ['addressComponents', 'displayName'] });
    }

    this.handleAddressChange(place);
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
