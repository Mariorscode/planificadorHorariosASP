/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StteperFormService } from './stteper-form.service';

describe('Service: StteperForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StteperFormService]
    });
  });

  it('should ...', inject([StteperFormService], (service: StteperFormService) => {
    expect(service).toBeTruthy();
  }));
});
