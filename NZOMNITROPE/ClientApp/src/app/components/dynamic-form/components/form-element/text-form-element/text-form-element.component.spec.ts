import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFormElementComponent } from './text-form-element.component';

describe('TextFormElementComponent', () => {
  let component: TextFormElementComponent;
  let fixture: ComponentFixture<TextFormElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextFormElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
