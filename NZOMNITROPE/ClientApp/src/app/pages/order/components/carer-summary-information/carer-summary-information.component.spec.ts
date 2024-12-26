import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarerSummaryInformationComponent } from './carer-summary-information.component';

describe('CarerSummaryInformationComponent', () => {
  let component: CarerSummaryInformationComponent;
  let fixture: ComponentFixture<CarerSummaryInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarerSummaryInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarerSummaryInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
