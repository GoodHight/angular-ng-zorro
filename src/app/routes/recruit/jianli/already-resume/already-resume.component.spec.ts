import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyResumeComponent } from './already-resume.component';

describe('AlreadyResumeComponent', () => {
  let component: AlreadyResumeComponent;
  let fixture: ComponentFixture<AlreadyResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlreadyResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlreadyResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
