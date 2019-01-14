/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LalustSelectPersonComponent } from './lalust-select-person.component';

describe('LalustSelectPersonComponent', () => {
  let component: LalustSelectPersonComponent;
  let fixture: ComponentFixture<LalustSelectPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LalustSelectPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LalustSelectPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
