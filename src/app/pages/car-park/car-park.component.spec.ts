import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarParkComponent } from './car-park.component';

describe('CarParkComponent', () => {
  let component: CarParkComponent;
  let fixture: ComponentFixture<CarParkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarParkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
