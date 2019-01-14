/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RuleService } from './rule.service';

describe('Service: Rule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RuleService]
    });
  });

  it('should ...', inject([RuleService], (service: RuleService) => {
    expect(service).toBeTruthy();
  }));
});
