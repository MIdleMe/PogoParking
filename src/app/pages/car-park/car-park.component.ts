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

    private DEFAULT_WORKSPACE = 'banca';
    public activeAccess: boolean = false;
    public buttonText: string = '¡EMPEZAMOS!'

    constructor(private router: Router, private parkingService: ParkingService, 
        private activatedRoute: ActivatedRoute, private toastr: ToastrService) {
    }

    public getTicket(): void {
        this.parkingService.setTicket().then(ticket => {
            this.toastr.success('Ticket created', `#${ticket.position ? ticket.position + 1 : 0}: ${ticket.code}`);
        }).catch(e => {
            this.toastr.error('Cancelled', e);
        });
    }
}
