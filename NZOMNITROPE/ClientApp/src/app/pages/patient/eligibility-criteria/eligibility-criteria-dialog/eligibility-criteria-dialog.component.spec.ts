import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityCriteriaDialogComponent } from './eligibility-criteria-dialog.component';

describe('EligibilityCriteriaDialogComponent', () => {
  let component: EligibilityCriteriaDialogComponent;
  let fixture: ComponentFixture<EligibilityCriteriaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EligibilityCriteriaDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EligibilityCriteriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
