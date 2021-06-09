import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
    selector: 'parking-lot',
    templateUrl: './parking-lot.component.html',
    styleUrls: ['./parking-lot.component.scss']
})
export class ParkingLotComponent {
    
    @Input() numberOfLots!: number;
    @Input() occupiedLots!: number;

    constructor(private _sanitizer:DomSanitizer) {}
    
    public counter(occupied: number): Array<any> {
        return new Array(occupied);
    }

    public hueTransform(position: number): SafeStyle {
        return this._sanitizer.bypassSecurityTrustStyle(`hue-rotate(${((parseInt(Math.PI.toFixed(20).toString().replace(',','')[position%20])%3)*120)-(position%3*120)}deg)`);
    }
}
