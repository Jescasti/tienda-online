/**
 * auth.guard.ts
 * Guards de navegación: deciden si el usuario puede entrar a una ruta.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Protege las pestañas de la tienda: si no hay sesión, redirige al login.
 */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.cargarSesion();
  return auth.autenticado() ? true : router.createUrlTree(['/login']);
};

/**
 * Protege la página de login: si ya hay sesión, lleva directo a la tienda.
 */
export const publicoGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.cargarSesion();
  return auth.autenticado() ? router.createUrlTree(['/tabs/productos']) : true;
};