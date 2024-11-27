import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFormElementComponent } from './select-form-element.component';

describe('SelectFormElementComponent', () => {
  let component: SelectFormElementComponent;
  let fixture: ComponentFixture<SelectFormElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFormElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
