import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsRegisterComponent } from './patients-register.component';

describe('RegistrationComponent', () => {
  let component: PatientsRegisterComponent;
  let fixture: ComponentFixture<PatientsRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
