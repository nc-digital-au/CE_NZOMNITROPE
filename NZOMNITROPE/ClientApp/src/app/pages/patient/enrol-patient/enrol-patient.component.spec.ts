import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolPatientComponent } from './enrol-patient.component';

describe('EnrolPatientComponent', () => {
  let component: EnrolPatientComponent;
  let fixture: ComponentFixture<EnrolPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrolPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnrolPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
