import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubclassesComponent } from './subclasses.component';

describe('SubclassesComponent', () => {
  let component: SubclassesComponent;
  let fixture: ComponentFixture<SubclassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubclassesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubclassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
