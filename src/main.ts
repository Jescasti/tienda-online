/**
 * main.ts
 * Punto de entrada de la aplicación. Arranca el componente raíz y registra
 * los proveedores globales: Ionic, router y cliente HTTP con el interceptor.
 */
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    // Conserva el estado de cada pestaña al navegar entre ellas.
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Habilita los componentes de Ionic.
    provideIonicAngular(),
    // Router; withComponentInputBinding pasa el :id de la ruta como input de la página.
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    // Cliente HTTP para consumir la API, con el interceptor que agrega el token JWT.
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
});