import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainDevelopmentComponent } from './train-development.component';

describe('TrainDevelopmentComponent', () => {
  let component: TrainDevelopmentComponent;
  let fixture: ComponentFixture<TrainDevelopmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainDevelopmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
