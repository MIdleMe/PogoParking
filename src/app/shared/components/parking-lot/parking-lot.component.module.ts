import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ParkingLotComponent } from './parking-lot.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        ParkingLotComponent
    ],
    declarations: [
        ParkingLotComponent
    ],
    providers: []
})
export class ParkingLotModule { }
