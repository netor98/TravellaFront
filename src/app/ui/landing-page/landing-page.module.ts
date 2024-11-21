import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageComponent} from './page/page.component';
import {LandingRoutingModule} from "./landing-routing.module";

import {
  SearchTripComponent
} from './components/search-trip/search-trip.component';
import {PrimegnModule} from "../../primegn/primegn.module";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {TopRoutesComponent} from './components/top-routes/top-routes.component';
import {FooterComponent} from './components/footer/footer.component';
import {
  InfoLandigComponent
} from './components/info-landig/info-landig.component';


@NgModule({
  declarations: [
    PageComponent,
    SearchTripComponent,
    TopRoutesComponent,
    FooterComponent,
    InfoLandigComponent
  ],
  exports: [
    FooterComponent,
    SearchTripComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule,
    PrimegnModule,
    FormsModule,
    SharedModule
  ]
})
export class LandingPageModule {
}
