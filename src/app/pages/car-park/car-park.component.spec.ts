import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { TicketModel } from 'src/app/shared/services/parking/parking.model';
import { ParkingServiceModule } from 'src/app/shared/services/parking/parking.service.module';
import { CarParkComponent } from './car-park.component';

describe('CarParkComponent', () => {
  let component: CarParkComponent;
  let fixture: ComponentFixture<CarParkComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, ParkingServiceModule, 
        ToastrModule.forRoot({
          positionClass :'toast-bottom-right'
        }),
        MatDialogModule ],
      declarations: [ CarParkComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(CarParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await component['parkingService'].clearAll();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create ticket', async () => {
    component.getTicket();
    await new Promise(r => setTimeout(r, 400));
    let parkedNumber: number = await component['parkingService'].getParkedNumber();
    expect(parkedNumber).toEqual(1);
  });

  it('should show success toast', async () => {
    component.getTicket();
    await new Promise(r => setTimeout(r, 400));
    expect(component['toastr'].currentlyActive).toBeTruthy();
  });

  it('should return price string', async () => {
    component.getTicket();
    await new Promise(r => setTimeout(r, 400));
    let tickets: TicketModel[] = await component['parkingService']['getTicketList']();
    let price: string = await component.calculatePrice(<string>tickets[0].code);
    expect(price).toBeTruthy();
  });

  it('should modify ticket paymentDate', async () => {
    component.getTicket();
    await new Promise(r => setTimeout(r, 400));
    let tickets: TicketModel[] = await component['parkingService']['getTicketList']();
    component.payTicket(<string>tickets[0].code, 1);
    await new Promise(r => setTimeout(r, 400));
    tickets = await component['parkingService']['getTicketList']();
    expect(tickets[0].data.paymentDate).toBeTruthy();
  });

  it('should return ticket state as unpaid', async () => {
    component.getTicket();
    await new Promise(r => setTimeout(r, 400));
    let tickets: TicketModel[] = await component['parkingService']['getTicketList']();
    let paymentState: number = await component.getTicketState(<string>tickets[0].code);
    expect(paymentState).toBeFalsy();
  });

  it('should return ticket state as paid', async () => {
    component.getTicket();
    await new Promise(r => setTimeout(r, 400));
    let tickets: TicketModel[] = await component['parkingService']['getTicketList']();
    component.payTicket(<string>tickets[0].code, 1);
    await new Promise(r => setTimeout(r, 400));
    tickets = await component['parkingService']['getTicketList']();
    let paymentState: number = await component.getTicketState(<string>tickets[0].code);
    expect(paymentState).toBeTruthy();
  });

  it('should return calculated free spaces', async () => {
    component.getTicket();
    await new Promise(r => setTimeout(r, 400));
    let tickets: TicketModel[] = await component['parkingService']['getTicketList']();
    let lotSize: number = await component['parkingService']['getParkingSpaces']();
    let freeSpaces: number = await component.calculateFreeSpaces();
    expect(freeSpaces).toEqual(lotSize - tickets.length);
  });
});
