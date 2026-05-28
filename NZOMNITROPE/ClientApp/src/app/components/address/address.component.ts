import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { DynamicForm } from '../dynamic-form/models/dynamic-form.model';
import { GroupFormElement } from '../dynamic-form/models/form-elements/group-form-element.model';
import { TextFormInputElement } from '../dynamic-form/models/form-elements/text-form-input-element.model';
import { MatLabel } from '@angular/material/form-field';
import { UI_DEFAULTS } from 'src/app/utils/constants';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    DynamicFormComponent,
    MatLabel,
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
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit, AfterViewInit {
  @Input()
  title: string;
  @Input()
  hiddenFields: string[] = [];
  @Input()
  searchHint: string;
  @Input()
  disabledFields: string[] = [];
  @Input() submitted = false;

  @Output()
  formCreated = new EventEmitter<FormGroup>();

  @ViewChild(DynamicFormComponent)
  dynamicForm: DynamicFormComponent;

  @ViewChild('placesContainer')
  placesContainer: ElementRef<HTMLDivElement>;

  addressFormDefinition: DynamicForm;

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => void this.initializePlaceAutocomplete(), 0);
  }

  private buildForm(): void {
    this.addressFormDefinition = new DynamicForm([
      new TextFormInputElement({
        name: 'name',
        label: 'Business name',
        hidden: this.hiddenFields.includes('name'),
        disabled: this.disabledFields.includes('name'),
        validation: {
          required: this.hiddenFields.includes('name') && this.disabledFields.includes('name'),
        }
      }),
      new GroupFormElement({
        children: [
          new TextFormInputElement({
            name: 'unitNumber',
            label: 'Unit number',
            hidden: this.hiddenFields.includes('unitNumber'),
            validation: {
              maxLength: UI_DEFAULTS.TEXT_INPUT_LIMIT,
            },
          })
        ],
      }),
      new TextFormInputElement({
        name: 'streetAddress',
        label: 'Street address',
        hidden: this.hiddenFields.includes('streetAddress'),
        validation: {
          required: !this.hiddenFields.includes('streetAddress'),
          maxLength: UI_DEFAULTS.ADDRESS_INPUT_LIMIT,
        },
      }),
      new TextFormInputElement({
        name: 'city',
        label: 'City',
        hidden: this.hiddenFields.includes('city'),
        validation: {
          required: !this.hiddenFields.includes('city'),
          maxLength: UI_DEFAULTS.TEXT_INPUT_LIMIT,
        },
      }),
      new GroupFormElement({
        children: [
          new TextFormInputElement({
            name: 'postcode',
            label: 'Post code',
            validation: {
              required: true,
              requiredLength: 4,
              numbersOnly: true,
            },
          }),
          new TextFormInputElement({
            name: 'phone',
            label: 'Phone number',
            hidden: this.hiddenFields.includes('phone'),
            validation: {
              phone: true,
              required: !this.hiddenFields.includes('phone'),
            },
          }),
        ],
      }),
    ]);
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  handleAddressChange(place: google.maps.places.PlaceResult | any) {
    this.dynamicForm.setValue('name', '');
    this.dynamicForm.setValue('postcode', '');
    this.dynamicForm.setValue('state', '');
    this.dynamicForm.setValue('name', '');
    this.dynamicForm.setValue('streetAddress', '');

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
          this.dynamicForm.setValue('postcode', longName);
          break;
        }

        case "locality":
          this.dynamicForm.setValue('city', longName);
          break;
      }
    }

    const placeName = place?.name ?? place?.displayName?.text ?? place?.displayName ?? '';

    let streetAddress = streetNumber;
    if (streetRoute) {
      streetAddress += ` ${streetRoute}`;
    }
    if (streetAddress) {
      this.dynamicForm.setValue('streetAddress', streetAddress);
      if (placeName) {
        this.dynamicForm.setValue('name', placeName);
      }
    } else {
      if (placeName) {
        this.dynamicForm.setValue('streetAddress', placeName);
      }
    }
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
      componentRestrictions: { country: ['nz'] },
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

  constructor(private loader: Loader) {}
}
