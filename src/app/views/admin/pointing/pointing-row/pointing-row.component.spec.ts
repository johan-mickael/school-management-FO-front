import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointingRowComponent } from './pointing-row.component';

describe('PointingRowComponent', () => {
  let component: PointingRowComponent;
  let fixture: ComponentFixture<PointingRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointingRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointingRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
