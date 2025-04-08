import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  AddressWithAddressTypeComponent } from './address-with-address-type.component';

describe('AddressWithAddressTypeComponent', () => {
  let component: AddressWithAddressTypeComponent;
  let fixture: ComponentFixture<AddressWithAddressTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressWithAddressTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressWithAddressTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
