import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignationComponent } from './esignation.component';

describe('EsignationComponent', () => {
  let component: EsignationComponent;
  let fixture: ComponentFixture<EsignationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsignationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
