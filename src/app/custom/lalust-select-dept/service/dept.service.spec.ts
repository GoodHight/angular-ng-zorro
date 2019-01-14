/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeptService } from './dept.service';

describe('Service: Dept', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeptService]
    });
  });

  it('should ...', inject([DeptService], (service: DeptService) => {
    expect(service).toBeTruthy();
  }));
});
