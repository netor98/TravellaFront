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
        path: 'reports',
        component: ReportsComponent
      },
      {
        path: 'routes',
        component: RoutesComponent
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
