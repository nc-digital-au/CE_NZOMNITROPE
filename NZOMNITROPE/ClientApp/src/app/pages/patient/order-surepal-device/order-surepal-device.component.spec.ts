import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSurepalDeviceComponent } from './order-surepal-device.component';

describe('OrderSurepalDeviceComponent', () => {
  let component: OrderSurepalDeviceComponent;
  let fixture: ComponentFixture<OrderSurepalDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSurepalDeviceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderSurepalDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
