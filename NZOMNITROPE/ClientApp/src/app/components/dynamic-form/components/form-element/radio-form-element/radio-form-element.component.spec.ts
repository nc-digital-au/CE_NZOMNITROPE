import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioFormElementComponent } from './radio-form-element.component';

describe('RadioFormElementComponent', () => {
  let component: RadioFormElementComponent;
  let fixture: ComponentFixture<RadioFormElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioFormElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadioFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
