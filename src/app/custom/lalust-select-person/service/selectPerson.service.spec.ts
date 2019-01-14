/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SelectPersonService } from './selectPerson.service';

describe('Service: SelectPerson', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectPersonService]
    });
  });

  it('should ...', inject([SelectPersonService], (service: SelectPersonService) => {
    expect(service).toBeTruthy();
  }));
});
