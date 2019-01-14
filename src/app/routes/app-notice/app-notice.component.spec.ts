import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNoticeComponent } from './app-notice.component';

describe('AppNoticeComponent', () => {
  let component: AppNoticeComponent;
  let fixture: ComponentFixture<AppNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
