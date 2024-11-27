import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReapprovePatientComponent } from './reapprove-patient.component';

describe('ReapprovePatientComponent', () => {
  let component: ReapprovePatientComponent;
  let fixture: ComponentFixture<ReapprovePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReapprovePatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReapprovePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
