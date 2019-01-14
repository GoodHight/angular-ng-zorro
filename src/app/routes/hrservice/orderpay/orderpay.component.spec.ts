import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderpayComponent } from './orderpay.component';

describe('OrderpayComponent', () => {
  let component: OrderpayComponent;
  let fixture: ComponentFixture<OrderpayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderpayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
