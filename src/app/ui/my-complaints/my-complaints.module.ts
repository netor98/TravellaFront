import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MyComplaintsRoutingModule} from './my-complaints-routing.module';
import {ComplaintComponent} from './components/complaint/complaint.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {LandingPageModule} from "../landing-page/landing-page.module";
import {PrimegnModule} from "../../primegn/primegn.module";


@NgModule({
  declarations: [
    ComplaintComponent
  ],
  imports: [
    CommonModule,
    MyComplaintsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LandingPageModule,
    PrimegnModule
  ]
})
export class MyComplaintsModule {
}
