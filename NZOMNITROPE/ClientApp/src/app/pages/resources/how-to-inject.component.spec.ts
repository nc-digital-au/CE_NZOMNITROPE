import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToInjectComponent } from './how-to-inject.component';

describe('HowToInjectComponent', () => {
  let component: HowToInjectComponent;
  let fixture: ComponentFixture<HowToInjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToInjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HowToInjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
