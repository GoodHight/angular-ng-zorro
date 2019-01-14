import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAddressComponent } from './attendance-address.component';

describe('AttendanceAddressComponent', () => {
  let component: AttendanceAddressComponent;
  let fixture: ComponentFixture<AttendanceAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
