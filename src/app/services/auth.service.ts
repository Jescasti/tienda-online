/**
 * auth.service.ts
 * Servicio de autenticación. Inicia sesión contra la API, guarda el token JWT
 * en el almacenamiento local y mantiene los datos del usuario autenticado.
 */
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { RespuestaLogin, Usuario } from '../models/tienda.models';
import { StorageService } from './storage.service';

// Claves con las que se guarda la sesión en el almacenamiento local.
const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // inject(): obtiene los servicios que necesita esta clase.
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  // Signals: guardan el estado y actualizan la pantalla cuando cambian.
  readonly token = signal<string | null>(null);
  readonly usuario = signal<Usuario | null>(null);

  // computed(): valor derivado; es true cuando existe un token.
  readonly autenticado = computed(() => this.token() !== null);

  // Evita leer el almacenamiento más de una vez.
  private sesionCargada = false;

  /**
   * Recupera la sesión guardada al abrir la app, para no pedir el login cada vez.
   */
  async cargarSesion(): Promise<void> {
    if (this.sesionCargada) {
      return;
    }
    this.token.set(await this.storage.obtener<string>(CLAVE_TOKEN));
    this.usuario.set(await this.storage.obtener<Usuario>(CLAVE_USUARIO));
    this.sesionCargada = true;
  }

  /**
   * Inicia sesión enviando el usuario y la contraseña a la API.
   * La API responde con un token JWT que se guarda en el dispositivo.
   * @param username nombre de usuario.
   * @param password contraseña.
   */
  async login(username: string, password: string): Promise<void> {
    const respuesta = await firstValueFrom(
      this.http.post<RespuestaLogin>(`${environment.apiUrl}/auth/login`, {
        username,
        password,
        expiresInMins: 60, // el token vence a los 60 minutos
      }),
    );

    // Se separan los datos del usuario de los tokens.
    const { accessToken, refreshToken, ...datosUsuario } = respuesta;

    this.token.set(accessToken);
    this.usuario.set(datosUsuario);

    // Se guarda la sesión en el almacenamiento local.
    await this.storage.guardar(CLAVE_TOKEN, accessToken);
    await this.storage.guardar(CLAVE_USUARIO, datosUsuario);
  }

  /**
   * Consulta el perfil del usuario en la API. Esta petición está protegida:
   * solo responde si se envía el token (lo agrega el interceptor).
   */
  async obtenerPerfil(): Promise<Usuario> {
    const perfil = await firstValueFrom(this.http.get<Usuario>(`${environment.apiUrl}/auth/me`));
    this.usuario.set(perfil);
    await this.storage.guardar(CLAVE_USUARIO, perfil);
    return perfil;
  }

  /**
   * Cierra la sesión: borra el token y los datos del usuario.
   */
  async logout(): Promise<void> {
    this.token.set(null);
    this.usuario.set(null);
    await this.storage.eliminar(CLAVE_TOKEN);
    await this.storage.eliminar(CLAVE_USUARIO);
  }
}