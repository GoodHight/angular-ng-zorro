/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LalustSelectPersonSingleComponent } from './lalust-select-person-single.component';

describe('LalustSelectPersonSingleComponent', () => {
  let component: LalustSelectPersonSingleComponent;
  let fixture: ComponentFixture<LalustSelectPersonSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LalustSelectPersonSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LalustSelectPersonSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
