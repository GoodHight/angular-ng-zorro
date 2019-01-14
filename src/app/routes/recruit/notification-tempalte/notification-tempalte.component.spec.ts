import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTempalteComponent } from './notification-tempalte.component';

describe('NotificationTempalteComponent', () => {
  let component: NotificationTempalteComponent;
  let fixture: ComponentFixture<NotificationTempalteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTempalteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTempalteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
