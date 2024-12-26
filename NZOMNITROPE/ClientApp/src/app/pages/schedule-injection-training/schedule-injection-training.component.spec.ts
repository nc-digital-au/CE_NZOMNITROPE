import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleInjectionTrainingComponent } from './schedule-injection-training.component';

describe('ScheduleInjectionTrainingComponent', () => {
  let component: ScheduleInjectionTrainingComponent;
  let fixture: ComponentFixture<ScheduleInjectionTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleInjectionTrainingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleInjectionTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
