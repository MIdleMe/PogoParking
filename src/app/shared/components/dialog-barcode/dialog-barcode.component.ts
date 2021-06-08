import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBarcodeData } from './dialog-barcode.component.model';


@Component({
    templateUrl: './dialog-barcode.component.html',
    styleUrls: ['./dialog-barcode.component.scss']
  })

export class DialogBarcodeComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogBarcodeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogBarcodeData) {}

    onNoClick(): void {
        this.data = <DialogBarcodeData>{};
        this.dialogRef.close();
    }

}

