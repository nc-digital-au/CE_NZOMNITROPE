import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRegistrationCarerComponent } from './patient-registration-carer.component';

describe('PatientRegistrationCarerComponent', () => {
  let component: PatientRegistrationCarerComponent;
  let fixture: ComponentFixture<PatientRegistrationCarerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientRegistrationCarerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientRegistrationCarerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
