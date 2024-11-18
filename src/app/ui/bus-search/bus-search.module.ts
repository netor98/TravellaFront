import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BusSearchRoutingModule} from './bus-search-routing.module';
import {
  SearchLayoutComponent
} from './layouts/search-layout/search-layout.component';
import {PrimegnModule} from "../../primegn/primegn.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    SearchLayoutComponent
  ],
  imports: [
    CommonModule,
    BusSearchRoutingModule,
    PrimegnModule,
    FormsModule
  ]
})
export class BusSearchModule {
}
