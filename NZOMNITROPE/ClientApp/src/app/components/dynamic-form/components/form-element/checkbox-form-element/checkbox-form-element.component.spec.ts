import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxFormElementComponent } from './checkbox-form-element.component';

describe('CheckboxFormElementComponent', () => {
  let component: CheckboxFormElementComponent;
  let fixture: ComponentFixture<CheckboxFormElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxFormElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckboxFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
