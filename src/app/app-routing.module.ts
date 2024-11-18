import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  isAuthenticatedGuard,
} from "./guards/is-authenticated-guard.guard";
import {roleGuard} from "./guards/role.guard";
import {isNotAuthenticatedGuard} from "./guards/is-not-authenticated.guard";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./ui/landing-page/landing-page.module')
      .then(m => m.LandingPageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./ui/auth/auth.module')
      .then(m => m.AuthModule),
    canActivate: [isNotAuthenticatedGuard]
  },
  {
    /*
        canActivate: [roleGuard],
    */
    path: 'dashboard',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./ui/dashboard/dashboard.module')
      .then(m => m.DashboardModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./ui/bus-search/bus-search.module')
      .then(m => m.BusSearchModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
