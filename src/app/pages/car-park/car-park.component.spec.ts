import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { ParkingServiceModule } from 'src/app/shared/services/parking/parking.service.module';
import { CarParkComponent } from './car-park.component';

describe('CarParkComponent', () => {
  let component: CarParkComponent;
  let fixture: ComponentFixture<CarParkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, ParkingServiceModule, 
        ToastrModule.forRoot({
          positionClass :'toast-bottom-right'
        }),
        MatDialogModule ],
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
