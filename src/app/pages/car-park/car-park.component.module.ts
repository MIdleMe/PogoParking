import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CarParkComponent } from './car-park.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        CarParkComponent
    ],
    declarations: [
        CarParkComponent
    ],
    providers: []
})
export class CarParkModule { }
