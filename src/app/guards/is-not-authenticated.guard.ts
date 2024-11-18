import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const url = state.url;
  const router = inject(Router);
  const token = localStorage.getItem('jwt');


  if (!token) {
    return true;
  }

  alert('You are already logged in');
  router.navigateByUrl('dashboard');
  return false;
};
