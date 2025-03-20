import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeFormElementComponent } from './time-form-element.component';

describe('TimeFormElementComponent', () => {
  let component: TimeFormElementComponent;
  let fixture: ComponentFixture<TimeFormElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeFormElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
