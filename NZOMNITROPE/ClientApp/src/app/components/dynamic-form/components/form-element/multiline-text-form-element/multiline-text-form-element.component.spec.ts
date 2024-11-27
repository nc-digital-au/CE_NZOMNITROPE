import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilineTextFormElementComponent } from './multiline-text-form-element.component';

describe('MultilineTextFormElementComponent', () => {
  let component: MultilineTextFormElementComponent;
  let fixture: ComponentFixture<MultilineTextFormElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultilineTextFormElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultilineTextFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
