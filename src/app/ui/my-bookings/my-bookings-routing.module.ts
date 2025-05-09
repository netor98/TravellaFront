import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyBookingsComponent} from "./layouts/my-bookings/my-bookings.component";

const routes: Routes = [
  {
    path: '',
    component: MyBookingsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyBookingsRoutingModule {
}
