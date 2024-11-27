import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFormElementComponent } from './group-form-element.component';

describe('GroupFormElementComponent', () => {
  let component: GroupFormElementComponent;
  let fixture: ComponentFixture<GroupFormElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupFormElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
