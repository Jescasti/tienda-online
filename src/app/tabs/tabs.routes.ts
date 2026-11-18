/**
 * tabs.routes.ts
 * Rutas de las pestañas de la tienda. Cada página se carga de forma diferida
 * (lazy loading) solo cuando el usuario la abre.
 */
import type { Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        // Pestaña 1: catálogo.
        path: 'productos',
        loadComponent: () => import('../pages/productos/productos.page').then((m) => m.ProductosPage),
      },
      {
        // Detalle de un producto; :id llega como input a la página.
        path: 'productos/:id',
        loadComponent: () =>
          import('../pages/producto-detalle/producto-detalle.page').then((m) => m.ProductoDetallePage),
      },
      {
        // Pestaña 2: carrito de compras.
        path: 'carrito',
        loadComponent: () => import('../pages/carrito/carrito.page').then((m) => m.CarritoPage),
      },
      {
        // Pestaña 3: perfil del usuario.
        path: 'perfil',
        loadComponent: () => import('../pages/perfil/perfil.page').then((m) => m.PerfilPage),
      },
      {
        // Sin pestaña indicada: se abre el catálogo.
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full',
      },
    ],
  },
];