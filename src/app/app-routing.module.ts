import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  isAuthenticatedGuard,
} from "./guards/is-authenticated-guard.guard";
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
    loadChildren: () => import('./ui/admin/admin.module')
      .then(m => m.AdminModule)
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
    path: 'complaints',
    loadChildren: () => import('./ui/my-complaints/my-complaints.module')
      .then(m => m.MyComplaintsModule),
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./ui/admin/admin.module')
      .then(m => m.AdminModule),
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
