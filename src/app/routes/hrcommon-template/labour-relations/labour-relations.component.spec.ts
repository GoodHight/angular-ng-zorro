import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabourRelationsComponent } from './labour-relations.component';

describe('LabourRelationsComponent', () => {
  let component: LabourRelationsComponent;
  let fixture: ComponentFixture<LabourRelationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabourRelationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabourRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
