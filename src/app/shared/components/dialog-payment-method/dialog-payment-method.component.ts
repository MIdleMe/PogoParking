import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogPaymentMethodData } from './dialog-payment-method.component.model';


@Component({
    templateUrl: './dialog-payment-method.component.html',
    styleUrls: ['./dialog-payment-method.component.scss']
  })

export class DialogPaymentMethodComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogPaymentMethodComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogPaymentMethodData) {}

    onNoClick(): void {
        this.data = <DialogPaymentMethodData>{};
        this.dialogRef.close();
    }

}

