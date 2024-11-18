import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";


export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const url = state.url;
  const router = inject(Router);
  const token = localStorage.getItem('jwt');

  if (token) {
    return true;
  }

  alert('You must be logged in to access this page');
  router.navigateByUrl('auth/login');
  return false;


}
