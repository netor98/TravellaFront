import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BookingRoutingModule} from './booking-routing.module';
import {SeatMapComponent} from './components/seat-map/seat-map.component';
import {PrimegnModule} from "../../primegn/primegn.module";
import {BookingComponent} from "./booking.component";
import {LandingPageModule} from "../landing-page/landing-page.module";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    SeatMapComponent,
    BookingComponent
  ],
  exports: [
    SeatMapComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    PrimegnModule,
    LandingPageModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BookingModule {
}
