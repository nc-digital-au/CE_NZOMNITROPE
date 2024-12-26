import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriberComponent } from './prescriber.component';

describe('PrescriberComponent', () => {
  let component: PrescriberComponent;
  let fixture: ComponentFixture<PrescriberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrescriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
