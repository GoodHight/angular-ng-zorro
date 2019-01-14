import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishAgainComponent } from './publish-again.component';

describe('PublishAgainComponent', () => {
  let component: PublishAgainComponent;
  let fixture: ComponentFixture<PublishAgainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishAgainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishAgainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
