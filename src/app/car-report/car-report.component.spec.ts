import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarReportComponent } from './car-report.component';

describe('CarReportComponent', () => {
  let component: CarReportComponent;
  let fixture: ComponentFixture<CarReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarReportComponent]
    });
    fixture = TestBed.createComponent(CarReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
