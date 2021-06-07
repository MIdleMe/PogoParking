import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ParkingService } from '../../shared/services/parking/parking.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialogBarcodeComponent } from '../../shared/common/dialog-barcode/dialog-barcode.component';
import { DialogPaymentMethodComponent } from '../../shared/common/dialog-payment-method/dialog-payment-method.component';

@Component({
    selector: 'car-park',
    templateUrl: './car-park.component.html',
    styleUrls: ['./car-park.component.scss']
})
export class CarParkComponent {
    title1: any = 'Parking lot';
    title2: any = 'Parking lot';
    subtitle1: any = 'Welcome to your parking';
    subtitle2: any = 'your parking app';
    fare: number = 2; // 2€ per every STARTED hour
    currentBarcode: string = '';


    private DEFAULT_WORKSPACE = 'banca';
    public activeAccess: boolean = false;
    public buttonText: string = '¡EMPEZAMOS!'

    constructor(private router: Router, private parkingService: ParkingService, 
        private activatedRoute: ActivatedRoute, private toastr: ToastrService, 
        private dialog: MatDialog) {
    }

    public getTicket(): void {

        this.parkingService.setTicket().then(ticket => {
            this.toastr.success('Ticket created', 
            `#${ticket.data.position ? ticket.data.position + 1 : 1}: ${ticket.code}`, 
            {
                timeOut: 10000
            });
        }).catch(e => {
            this.toastr.error('Cancelled', e);
        });
        
    }

    public openPaymentDialog(): void {

        let dialogRef = this.dialog.open(DialogBarcodeComponent, {
            data: {barcode: this.currentBarcode}
        });
        dialogRef.afterClosed().subscribe(result => {
            this.currentBarcode = result;
            if (this.currentBarcode) {
                this.calculatePrice(result).then(price => {
                    let dialogRef2 = this.dialog.open(DialogPaymentMethodComponent, {
                        data: {payment: price, paymentMethod: 1}
                    });
                    dialogRef2.afterClosed().subscribe(result => {
                        if (result)
                            this.payTicket(this.currentBarcode, result);
                    });
                });
            }
        });

    }

    public calculatePrice(barcode: string): Promise<string> {

        return new Promise((resolve, reject) => {
            this.parkingService.getTicket(barcode).then(ticket => {
                if (!!ticket.data.paymentDate)
                    throw new Error('Ticket already payed');
                let price: number = ticket.data.date ? 
                    Math.trunc((Date.now() - ticket.data.date)/(3.6*10**6))  * this.fare 
                : 0;
                this.toastr.warning(`Ticket code: ${ticket.code}`, `Total: ${price}€`);
                resolve(price+'€');
            }).catch(e => {
                reject(e);
                this.toastr.error('Cancelled', e);
            });
        });
        
    }

    public payTicket(barcode: string, paymentMethod: number) {

        this.parkingService.editTicket(barcode, {paymentOption: paymentMethod, paymentDate: Date.now()}).then(ticket => {
            console.log(ticket);
            this.toastr.info('Ticket paid', `#${ticket.data.position !== null && ticket.data.position !== undefined ? 
                ticket.data.position + 1 : 'undefined'}: ${ticket.code}`);
            this.currentBarcode = '';
        }).catch(e => {
            this.toastr.error('Cancelled', e);
        });

    }
}
