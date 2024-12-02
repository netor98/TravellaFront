import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {MyPageComponent} from './components/pages/my-page/my-page.component';
import {TripsComponent} from './components/pages/trips/trips.component';
import {ButtonDirective} from "primeng/button";
import {ChartModule} from "primeng/chart";
import {MenuModule} from "primeng/menu";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {
  ProductService
} from "../../../assets/demo/demo/service/product.service";
import {Ripple} from "primeng/ripple";
import {DriversComponent} from './components/pages/drivers/drivers.component';
import {
  MaintenanceComponent
} from './components/pages/maintenance/maintenance.component';
import {ReportsComponent} from './components/pages/reports/reports.component';
import {
  ComplaintsComponent
} from './components/pages/complaints/complaints.component';
import {RoutesComponent} from './components/pages/routes/routes.component';


@NgModule({
  declarations: [

    MyPageComponent,
    TripsComponent,
    DriversComponent,
    MaintenanceComponent,
    ReportsComponent,
    ComplaintsComponent,
    RoutesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ButtonDirective,
    ChartModule,
    MenuModule,
    PrimeTemplate,
    TableModule,
    Ripple,
  ]
})
export class AdminModule {
}
