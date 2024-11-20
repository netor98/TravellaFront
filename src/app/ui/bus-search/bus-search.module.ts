import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BusSearchRoutingModule} from './bus-search-routing.module';
import {
  SearchLayoutComponent
} from './layouts/search-layout/search-layout.component';
import {PrimegnModule} from "../../primegn/primegn.module";
import {FormsModule} from "@angular/forms";
import { SearchDetailsComponent } from './components/search-details/search-details.component';
import {SharedModule} from "../../shared/shared.module";
import {LandingPageModule} from "../landing-page/landing-page.module";
import { SidebarFiltersComponent } from './components/sidebar-filters/sidebar-filters.component';


@NgModule({
  declarations: [
    SearchLayoutComponent,
    SearchDetailsComponent,
    SidebarFiltersComponent
  ],
  imports: [
    CommonModule,
    BusSearchRoutingModule,
    PrimegnModule,
    FormsModule,
    SharedModule,
    LandingPageModule
  ]
})
export class BusSearchModule {
}
