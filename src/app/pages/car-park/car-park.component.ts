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
    availableLots: number = 0;


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
            this.calculateFreeSpaces();
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
            this.parkingService.getTicketState(barcode).then(state => {
                if (state)
                    throw new Error('Ticket already payed');
                this.parkingService.getTicket(barcode).then(ticket => {
                    let price: number = ticket.data.date ? 
                        Math.trunc((Date.now() - ticket.data.date)/(3.6*10**6))  * this.fare 
                    : 0;
                    this.toastr.warning(`Ticket code: ${ticket.code}`, `Total: ${price}€`);
                    resolve(price+'€');
                }).catch(e => {
                    reject(e);
                    this.toastr.error('Cancelled', e);
                });
            }).catch(e => {
                reject(e);
                this.toastr.error('Cancelled', e);
            });
        });
        
    }

    public payTicket(barcode: string, paymentMethod: number) {

        let now: number = Date.now();
        this.parkingService.editTicket(barcode, {date: now, paymentOption: paymentMethod, paymentDate: now}).then(ticket => {
            this.toastr.info('Ticket paid', `#${ticket.data.position !== null && ticket.data.position !== undefined ? 
                ticket.data.position + 1 : 'undefined'}: ${ticket.code}`);
            this.currentBarcode = '';
        }).catch(e => {
            this.toastr.error('Cancelled', e);
        });

    }

    public openGate(barcode: string): void {

        this.parkingService.getTicketState(barcode).then(state => {
            console.log(state);
            switch (state) {
                case 1:
                    this.parkingService.editTicket(barcode, {hasExited: true}).then(ticket => {
                        this.toastr.success('Exit opened', 'Thank you');
                        this.calculateFreeSpaces();
                    }).catch(e => {
                        this.toastr.error('Cancelled', e);
                    });
                    break;
                case 2:
                    this.toastr.error('Exit closed', 'this ticket has already been used');
                    break;
                default:
                    this.toastr.error('Exit closed', 'Please, proccede to renew your payment');
            }
        }).catch(e => {
            this.toastr.error('Exit closed', e);
        });

    }

    public openGateDialog(): void {

        let dialogRef = this.dialog.open(DialogBarcodeComponent, {
            data: {barcode: this.currentBarcode}
        });
        dialogRef.afterClosed().subscribe(result => {
            this.currentBarcode = result;
            if (this.currentBarcode) {
                this.openGate(result);
            }
        });

    }

    public calculateFreeSpaces(): Promise<number> {

        return new Promise((resolve, reject) => {
            Promise.all([this.parkingService.getParkedNumber(), 
                this.parkingService.getParkingSpaces()]).then(responses => {
                    console.log(responses);
                    this.availableLots = responses[1] - responses[0];
                    resolve(this.availableLots);
                }).catch(e => {
                    reject(e);
                });
        });

    }

    public getFreeSpaces(): void {

        this.calculateFreeSpaces().then(lots => {
            if (lots) {
                this.toastr.success('Available spaces', `There are ${lots} available spaces`);
            } else {
                this.toastr.error('No available spaces', 'There are 0 available spaces');
            }
        }).catch(e => {
            this.toastr.error('Exit closed', e);
        });

    }
}
