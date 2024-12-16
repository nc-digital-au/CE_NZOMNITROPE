import { NgxGpAutocompleteModule, NgxGpAutocompleteOptions } from '@angular-magic/ngx-gp-autocomplete';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectOption } from '@kolkov/angular-editor';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { DynamicForm } from '../dynamic-form/models/dynamic-form.model';
import { GroupFormElement } from '../dynamic-form/models/form-elements/group-form-element.model';
import { SelectFormInputElement } from '../dynamic-form/models/form-elements/select-form-input-element.model';
import { TextFormInputElement } from '../dynamic-form/models/form-elements/text-form-input-element.model';
import { MatLabel, MatFormField, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AddressState } from 'src/app/services/service-proxies/service-proxies';
import { UI_DEFAULTS } from 'src/app/utils/constants';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    DynamicFormComponent,
    MatLabel,
    MatFormField,
    MatInput,
    MatHint,
    NgxGpAutocompleteModule,
    CommonModule
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
export class AddressComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  establishmentOnly = true;
  @Input()
  hiddenFields: string[] = [];
  @Input()
  searchHint: string;

  @Output()
  formCreated = new EventEmitter<FormGroup>();

  @ViewChild(DynamicFormComponent)
  dynamicForm: DynamicFormComponent;

  addressFormDefinition: DynamicForm;

  options: NgxGpAutocompleteOptions = {
    componentRestrictions: { country: ['au'] },
    fields: ['name', 'address_components', 'geometry'],
  };

  ngOnInit(): void {
    this.options.types = [this.establishmentOnly ? 'establishment' : 'address'];

    const stateOptions: SelectOption[] = [];
    const stateKeys = Object.keys(AddressState).filter(key => isNaN(Number(key)));
    stateKeys.forEach((key, i) => {
      stateOptions.push({
        label: key,
        value: AddressState[key],
      })
    });

    this.addressFormDefinition = new DynamicForm([
      new TextFormInputElement({
        name: 'name',
        label: 'Clinic/Practice name',
        hidden: this.hiddenFields.includes('name'),
        validation: {
          required: !this.hiddenFields.includes('name'),
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
          }),
          undefined,
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
          new SelectFormInputElement({
            name: 'state',
            label: 'State',
            options: stateOptions,
            validation: {
              required: true,
            },
          }),
          new TextFormInputElement({
            name: 'postcode',
            label: 'Post code',
            validation: {
              required: true,
              requiredLength: 4,
              numbersOnly: true,
            },
          }),
        ],
      }),
      new GroupFormElement({
        children: [
          new TextFormInputElement({
            name: 'phone',
            label: 'Phone number',
            hidden: this.hiddenFields.includes('phone'),
            validation: {
              phone: true,
              required: !this.hiddenFields.includes('phone'),
            },
          }),
          new TextFormInputElement({
            name: 'mobile',
            label: 'Mobile number',
            hidden: this.hiddenFields.includes('mobile'),
            validation: {
              mobile: true,
              required: !this.hiddenFields.includes('mobile'),
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

        case "administrative_area_level_1": {
          this.dynamicForm.setValue('state', AddressState[component.short_name]);
          break;
        }
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
}
