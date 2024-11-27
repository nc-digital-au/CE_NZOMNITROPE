import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFormElementComponent } from './display-form-element.component';

describe('DisplayFormElementComponent', () => {
  let component: DisplayFormElementComponent;
  let fixture: ComponentFixture<DisplayFormElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayFormElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
