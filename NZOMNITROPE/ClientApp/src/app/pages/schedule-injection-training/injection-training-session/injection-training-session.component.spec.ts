import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjectionTrainingSessionComponent } from './injection-training-session.component';

describe('InjectionTrainingSessionComponent', () => {
  let component: InjectionTrainingSessionComponent;
  let fixture: ComponentFixture<InjectionTrainingSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InjectionTrainingSessionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InjectionTrainingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
