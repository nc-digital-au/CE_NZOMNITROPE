import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRegistrationTermsComponent } from './patient-registration-terms.component';

describe('PatientRegistrationTermsComponent', () => {
  let component: PatientRegistrationTermsComponent;
  let fixture: ComponentFixture<PatientRegistrationTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientRegistrationTermsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientRegistrationTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
