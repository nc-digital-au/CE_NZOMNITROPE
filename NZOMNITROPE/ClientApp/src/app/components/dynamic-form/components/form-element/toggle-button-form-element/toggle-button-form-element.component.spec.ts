import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleButtonFormElementComponent } from './toggle-button-form-element.component';

describe('ToggleButtonFormElementComponent', () => {
  let component: ToggleButtonFormElementComponent;
  let fixture: ComponentFixture<ToggleButtonFormElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleButtonFormElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToggleButtonFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
