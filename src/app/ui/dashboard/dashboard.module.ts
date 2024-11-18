import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {
  DashboardLayoutComponent
} from './layouts/dashboard-layout/dashboard-layout.component';
import {
  TestCitiesComponent
} from './components/test-cities/test-cities.component';


@NgModule({
  declarations: [
    DashboardLayoutComponent,
    TestCitiesComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {
}
