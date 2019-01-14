import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPlanComponent } from './person-plan.component';

describe('PersonPlanComponent', () => {
  let component: PersonPlanComponent;
  let fixture: ComponentFixture<PersonPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
