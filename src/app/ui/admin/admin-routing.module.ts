import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppLayoutComponent} from "../../layout/app.layout.component";
import {MyPageComponent} from "./components/pages/my-page/my-page.component";
import {
  MaintenanceComponent
} from "./components/pages/maintenance/maintenance.component";
import {DriversComponent} from "./components/pages/drivers/drivers.component";
import {
  ComplaintsComponent
} from "./components/pages/complaints/complaints.component";
import {ReportsComponent} from "./components/pages/reports/reports.component";
import {RoutesComponent} from "./components/pages/routes/routes.component";
import {TripsComponent} from "./components/pages/trips/trips.component";
import {CitiesComponent} from "./components/pages/cities/cities.component";

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: MyPageComponent
      },
      {
        path: 'maintenance',
        component: MaintenanceComponent
      },
      {
        path: 'drivers',
        component: DriversComponent
      },
      {
        path: 'complaints',
        component: ComplaintsComponent
      },
      {
        path: 'cities',
        component: CitiesComponent
      },
      {
        path: 'routes',
        component: RoutesComponent
      },
      {
        path: 'trips',
        component: TripsComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
