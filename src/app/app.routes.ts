/**
 * app.routes.ts
 * Rutas principales: login (público) y pestañas de la tienda (protegidas).
 */
import type { Routes } from '@angular/router';

import { authGuard, publicoGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    // Inicio de sesión: si ya hay sesión, publicoGuard lleva a la tienda.
    path: 'login',
    canActivate: [publicoGuard],
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    // Pestañas de la tienda: authGuard exige haber iniciado sesión.
    path: 'tabs',
    canActivate: [authGuard],
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    // Ruta raíz: se envía a la tienda (el guard decide si va al login).
    path: '',
    redirectTo: 'tabs/productos',
    pathMatch: 'full',
  },
  {
    // Cualquier ruta desconocida vuelve a la tienda.
    path: '**',
    redirectTo: 'tabs/productos',
  },
];