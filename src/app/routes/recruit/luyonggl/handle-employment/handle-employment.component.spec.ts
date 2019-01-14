import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleEmploymentComponent } from './handle-employment.component';

describe('HandleEmploymentComponent', () => {
  let component: HandleEmploymentComponent;
  let fixture: ComponentFixture<HandleEmploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandleEmploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleEmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
