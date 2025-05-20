import { NgxGpAutocompleteModule, NgxGpAutocompleteOptions } from '@angular-magic/ngx-gp-autocomplete';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { DynamicForm } from '../dynamic-form/models/dynamic-form.model';
import { GroupFormElement } from '../dynamic-form/models/form-elements/group-form-element.model';
import { TextFormInputElement } from '../dynamic-form/models/form-elements/text-form-input-element.model';
import { MatLabel, MatFormField, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { UI_DEFAULTS } from 'src/app/utils/constants';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-address-with-address-type',
  standalone: true,
  imports: [
    DynamicFormComponent,
    MatLabel,
    MatFormField,
    MatInput,
    MatHint,
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
  templateUrl: './address-with-address-type.component.html',
  styleUrl: './address-with-address-type.component.scss'
})
export class AddressWithAddressTypeComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() title: string;
  @Input() hiddenFields: string[] = [];
  @Input() searchHint: string;
  @Input() disabledFields: string[] = [];
  @Input() establishmentOnly: boolean = true;
  @Input() key: any;

  @Output() formCreated = new EventEmitter<FormGroup>();

  private hasPatchedInitialValues = false;

  @ViewChild(DynamicFormComponent)
  dynamicForm: DynamicFormComponent;

  addressFormDefinition: DynamicForm;

  get options(): NgxGpAutocompleteOptions {
    return {
      componentRestrictions: { country: ['nz'] },
      fields: ['name', 'address_components', 'geometry'],
      types: this.establishmentOnly ? ['establishment'] : ['address']
    };
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateAutocompleteOptions(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['establishmentOnly'] && !changes['establishmentOnly'].firstChange) {
      this.buildForm();
      setTimeout(() => this.updateAutocompleteOptions(), 0);
    }
  }

  @Input()
  set addressValues(values: any) {
    if (values && this.dynamicForm?.form && !this.hasPatchedInitialValues) {
      this.dynamicForm.form.patchValue(values);
      this.hasPatchedInitialValues = true;
    }
  }

  private buildForm(): void {
    this.hasPatchedInitialValues = false;
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

  handleAddressChange(place: google.maps.places.PlaceResult) {
    this.dynamicForm.setValue('name', '');
    this.dynamicForm.setValue('postcode', '');
    this.dynamicForm.setValue('state', '');
    this.dynamicForm.setValue('name', '');
    this.dynamicForm.setValue('streetAddress', '');

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
          this.dynamicForm.setValue('postcode', component.long_name);
          break;
        }
        case "locality":
          this.dynamicForm.setValue('city', component.long_name);
          break;
      }
    }

    let streetAddress = streetNumber;
    if (streetRoute) {
      streetAddress += ` ${streetRoute}`;
    }
    if (streetAddress) {
      this.dynamicForm.setValue('streetAddress', streetAddress);
      if (place.name) {
        this.dynamicForm.setValue('name', place.name);
      }
    } else {
      if (place.name) {
        this.dynamicForm.setValue('streetAddress', place.name);
      }
    }
  }

  private updateAutocompleteOptions(): void {
    const autocomplete = (this.dynamicForm as any)?.placesInput;
    if (autocomplete?.initAutocomplete) {
      autocomplete.options = this.options;
      autocomplete.initAutocomplete();
    }
  }
}
