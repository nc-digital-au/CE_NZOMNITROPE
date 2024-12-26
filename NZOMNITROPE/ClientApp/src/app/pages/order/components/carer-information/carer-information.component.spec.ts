import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarerInformationComponent } from './carer-information.component';

describe('CarerInformationComponent', () => {
  let component: CarerInformationComponent;
  let fixture: ComponentFixture<CarerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarerInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
