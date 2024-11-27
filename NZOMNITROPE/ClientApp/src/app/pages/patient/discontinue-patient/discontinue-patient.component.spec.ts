import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscontinuePatientComponent } from './discontinue-patient.component';

describe('DiscontinuePatientComponent', () => {
  let component: DiscontinuePatientComponent;
  let fixture: ComponentFixture<DiscontinuePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscontinuePatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscontinuePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
