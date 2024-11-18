import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  SearchLayoutComponent
} from "./layouts/search-layout/search-layout.component";

const routes: Routes = [
  {
    path: '',
    component: SearchLayoutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusSearchRoutingModule {
}
