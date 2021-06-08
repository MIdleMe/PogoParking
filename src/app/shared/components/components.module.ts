import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogBarcodeComponent } from './dialog-barcode/dialog-barcode.component';
import { FormsModule } from '@angular/forms';
import { DialogPaymentMethodComponent } from './dialog-payment-method/dialog-payment-method.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { ParkingLotModule } from './parking-lot/parking-lot.component.module';

@NgModule({
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatRadioModule,
        MatButtonModule,
        ParkingLotModule
    ],
    exports: [
        ParkingLotModule
    ],
    declarations: [
        DialogBarcodeComponent,
        DialogPaymentMethodComponent
    ],
    entryComponents: [
      DialogBarcodeComponent,
      DialogPaymentMethodComponent
    ],
    providers: []
})
export class ComponentsModule { }
