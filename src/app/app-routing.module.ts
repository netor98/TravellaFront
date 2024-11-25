import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  isAuthenticatedGuard,
} from "./guards/is-authenticated-guard.guard";
import {roleGuard} from "./guards/role.guard";
import {isNotAuthenticatedGuard} from "./guards/is-not-authenticated.guard";
import {BookingComponent} from "./ui/booking/booking.component";

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
    path: 'booking',
    loadChildren: () => import('./ui/booking/booking.module')
      .then(m => m.BookingModule)
  },

  {
    path: 'my-bookings',
    loadChildren: () => import('./ui/my-bookings/my-bookings.module')
      .then(m => m.MyBookingsModule),
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
