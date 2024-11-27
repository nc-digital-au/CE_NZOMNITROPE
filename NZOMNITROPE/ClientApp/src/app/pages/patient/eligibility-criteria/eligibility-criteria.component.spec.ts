import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityCriteriaComponent } from './eligibility-criteria.component';

describe('EligibilityCriteriaComponent', () => {
  let component: EligibilityCriteriaComponent;
  let fixture: ComponentFixture<EligibilityCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EligibilityCriteriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EligibilityCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
