/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LalustSelectDeptComponent } from './lalust-select-dept.component';

describe('LalustSelectDeptComponent', () => {
  let component: LalustSelectDeptComponent;
  let fixture: ComponentFixture<LalustSelectDeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LalustSelectDeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LalustSelectDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
