/**
 * auth.interceptor.ts
 * Interceptor HTTP: revisa cada petición que sale hacia la API y le agrega el
 * token JWT en el encabezado "Authorization: Bearer <token>".
 * Si la API responde 401 (token vencido o inválido), cierra la sesión y lleva al login.
 */
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token();

  // Solo se agrega el token a las peticiones dirigidas a nuestra API.
  const peticion =
    token && req.url.startsWith(environment.apiUrl)
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 en una ruta protegida: la sesión ya no es válida.
      if (error.status === 401 && !req.url.endsWith('/auth/login')) {
        auth.logout();
        router.navigateByUrl('/login', { replaceUrl: true });
      }
      return throwError(() => error);
    }),
  );
};