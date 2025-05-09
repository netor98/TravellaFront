import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PageComponent} from "./page/page.component";


const routes: Routes = [
  {path: '', component: PageComponent} // Default route for the landing module
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule {
}
