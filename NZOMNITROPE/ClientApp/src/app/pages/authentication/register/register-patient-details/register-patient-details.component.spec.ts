import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPatientDetailsComponent } from './register-patient-details.component';

describe('RegisterPatientDetailsComponent', () => {
  let component: RegisterPatientDetailsComponent;
  let fixture: ComponentFixture<RegisterPatientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPatientDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPatientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
