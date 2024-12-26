import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedPrescriptionComponent } from './recommended-prescription.component';

describe('RecommendedPrescriptionComponent', () => {
  let component: RecommendedPrescriptionComponent;
  let fixture: ComponentFixture<RecommendedPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedPrescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommendedPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
