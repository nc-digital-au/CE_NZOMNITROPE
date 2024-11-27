import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcpFormComponent } from './hcp-form.component';

describe('HcpFormComponent', () => {
  let component: HcpFormComponent;
  let fixture: ComponentFixture<HcpFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HcpFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HcpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
