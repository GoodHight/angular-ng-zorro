import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccPayDetalisComponent } from './acc-pay-detalis.component';

describe('AccPayDetalisComponent', () => {
  let component: AccPayDetalisComponent;
  let fixture: ComponentFixture<AccPayDetalisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccPayDetalisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccPayDetalisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
