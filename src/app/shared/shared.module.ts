import { NgModule } from "@angular/core";
import { ServicesModule } from './services/services.module';
import { CommonModule } from './common/common.module';

@NgModule({
    imports: [
        ServicesModule,
        CommonModule
    ],
    declarations: [],
    exports: [],
    providers: []
})
export class SharedModule { }