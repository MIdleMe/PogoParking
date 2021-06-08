import { NgModule } from "@angular/core";
import { ServicesModule } from './services/services.module';
import { ComponentsModule } from './components/components.module';
import { MaterialModule } from "./material/material.module";

@NgModule({
    imports: [
        ServicesModule,
        ComponentsModule,
        MaterialModule
    ],
    declarations: [],
    exports: [
        ServicesModule,
        ComponentsModule,
        MaterialModule
    ],
    providers: []
})
export class SharedModule { }