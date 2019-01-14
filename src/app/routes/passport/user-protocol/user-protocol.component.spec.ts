import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProtocolComponent } from './user-protocol.component';

describe('UserProtocolComponent', () => {
  let component: UserProtocolComponent;
  let fixture: ComponentFixture<UserProtocolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProtocolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProtocolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
