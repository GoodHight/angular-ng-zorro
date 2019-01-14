import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateAddComponent } from './certificate-add.component';

describe('CertificateAddComponent', () => {
  let component: CertificateAddComponent;
  let fixture: ComponentFixture<CertificateAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
