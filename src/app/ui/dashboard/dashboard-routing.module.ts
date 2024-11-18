import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  DashboardLayoutComponent
} from "./layouts/dashboard-layout/dashboard-layout.component";
import {
  TestCitiesComponent
} from "./components/test-cities/test-cities.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
  },
  {
    path: 'test',
    component: TestCitiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
