import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MyBookingsRoutingModule} from './my-bookings-routing.module';
import {MyBookingsComponent} from './layouts/my-bookings/my-bookings.component';
import {PrimegnModule} from "../../primegn/primegn.module";
import {SharedModule} from "../../shared/shared.module";
import {LandingPageModule} from "../landing-page/landing-page.module";


@NgModule({
  declarations: [
    MyBookingsComponent
  ],
  imports: [
    CommonModule,
    MyBookingsRoutingModule,
    PrimegnModule,
    SharedModule,
    LandingPageModule
  ]
})
export class MyBookingsModule {
}
