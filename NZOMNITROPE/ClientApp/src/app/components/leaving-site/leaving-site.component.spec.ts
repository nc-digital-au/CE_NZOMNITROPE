import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavingSiteComponent } from './leaving-site.component';

describe('LeavingSiteComponent', () => {
  let component: LeavingSiteComponent;
  let fixture: ComponentFixture<LeavingSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavingSiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeavingSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
