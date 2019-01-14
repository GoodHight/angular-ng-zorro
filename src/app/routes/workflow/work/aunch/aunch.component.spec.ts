import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AunchComponent } from './aunch.component';

describe('AunchComponent', () => {
  let component: AunchComponent;
  let fixture: ComponentFixture<AunchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AunchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
