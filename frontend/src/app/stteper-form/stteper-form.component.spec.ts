import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StteperFormComponent } from './stteper-form.component';

describe('StteperFormComponent', () => {
  let component: StteperFormComponent;
  let fixture: ComponentFixture<StteperFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StteperFormComponent]
    });
    fixture = TestBed.createComponent(StteperFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
