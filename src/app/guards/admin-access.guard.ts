import {CanActivateFn, Router} from '@angular/router';
import {inject, Inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const adminAccessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inyecta el Router
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (user?.role === 'Admin') {
    return true; // Permitir acceso
  } else {
    // Redirigir al usuario a una página específica
    router.navigate(['/not-authorized']); // Ruta personalizada para usuarios no autorizados
    return false;
  }
};
