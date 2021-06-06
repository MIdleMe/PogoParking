import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ParkingService } from '../../shared/services/parking/parking.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'car-park',
    templateUrl: './car-park.component.html',
    styleUrls: ['./car-park.component.scss']
})
export class CarParkComponent {
    title1 = 'Parking lot';
    title2 = 'Parking lot';
    subtitle1 = 'Welcome to your parking';
    subtitle2 = 'your parking app';
    fare = 2; // 2€ per every STARTED hour

    private DEFAULT_WORKSPACE = 'banca';
    public activeAccess: boolean = false;
    public buttonText: string = '¡EMPEZAMOS!'

    constructor(private router: Router, private parkingService: ParkingService, 
        private activatedRoute: ActivatedRoute, private toastr: ToastrService) {
    }

    public getTicket(): void {
        this.parkingService.setTicket().then(ticket => {
            this.toastr.success('Ticket created', `#${ticket.data.position ? ticket.data.position + 1 : 0}: ${ticket.code}`);
        }).catch(e => {
            this.toastr.error('Cancelled', e);
        });
    }

    public calculatePrice(barcode: string): void {
        this.parkingService.getTicket(barcode).then(ticket => {
            let price: number = (new Date(ticket.data.date || Date.now()).getHours() - new Date(Date.now()).getHours()) * this.fare;
            this.toastr.warning(`Ticket code: ${ticket.code}`, `Total: ${price}€`);
        }).catch(e => {
            this.toastr.error('Cancelled', e);
        });
    }

    public payTicket(barcode: string, paymentMethod: number) {
        this.parkingService.editTicket(barcode, {paymentOption: paymentMethod, paymentDate: Date.now()}).then(ticket => {
            this.toastr.info('Ticket paid', `#${ticket.data.position ? ticket.data.position + 1 : 'undefined'}: ${ticket.code}`);
        }).catch(e => {
            this.toastr.error('Cancelled', e);
        });
    }
}
