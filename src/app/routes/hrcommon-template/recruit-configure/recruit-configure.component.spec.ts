import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitConfigureComponent } from './recruit-configure.component';

describe('RecruitConfigureComponent', () => {
  let component: RecruitConfigureComponent;
  let fixture: ComponentFixture<RecruitConfigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitConfigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
