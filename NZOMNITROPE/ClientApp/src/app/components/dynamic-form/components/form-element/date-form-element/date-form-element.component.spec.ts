import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFormElementComponent } from './date-form-element.component';

describe('DateFormElementComponent', () => {
  let component: DateFormElementComponent;
  let fixture: ComponentFixture<DateFormElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateFormElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DateFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
