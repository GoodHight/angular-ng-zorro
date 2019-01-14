import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyinterviewComponent } from './alreadyinterview.component';

describe('AlreadyinterviewComponent', () => {
  let component: AlreadyinterviewComponent;
  let fixture: ComponentFixture<AlreadyinterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlreadyinterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlreadyinterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
