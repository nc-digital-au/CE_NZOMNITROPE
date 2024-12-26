import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSummaryInformationComponent } from './patient-summary-information.component';

describe('PatientSummaryInformationComponent', () => {
  let component: PatientSummaryInformationComponent;
  let fixture: ComponentFixture<PatientSummaryInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSummaryInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientSummaryInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
