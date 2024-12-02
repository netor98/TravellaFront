import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComplaintComponent} from "./components/complaint/complaint.component";

const routes: Routes = [
  {
    path: ':orderId',
    component: ComplaintComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyComplaintsRoutingModule {
}
