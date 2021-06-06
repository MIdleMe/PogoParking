import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarParkComponent } from './pages/car-park/car-park.component'

const routes: Routes = [
  { path: '', component: CarParkComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
