import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionBookingComponent } from './session-booking.component';

describe('SessionBookingComponent', () => {
  let component: SessionBookingComponent;
  let fixture: ComponentFixture<SessionBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
