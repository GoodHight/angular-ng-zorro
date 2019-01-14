import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewMessageComponent } from './lookoffer.component';

describe('InterviewMessageComponent', () => {
  let component: InterviewMessageComponent;
  let fixture: ComponentFixture<InterviewMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
