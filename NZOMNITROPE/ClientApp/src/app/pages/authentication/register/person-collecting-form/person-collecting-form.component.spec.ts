import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonCollectingFormComponent } from './person-collecting-form.component';

describe('PersonCollectingFormComponent', () => {
  let component: PersonCollectingFormComponent;
  let fixture: ComponentFixture<PersonCollectingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonCollectingFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonCollectingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
