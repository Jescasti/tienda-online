/**
 * login.page.ts
 * Página de inicio de sesión. Envía el usuario y la contraseña al AuthService
 * y, si son correctos, lleva al usuario a la tienda.
 */
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonNote,
  IonSpinner,
  IonText,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { storefront } from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [FormsModule, IonContent, IonInput, IonInputPasswordToggle, IonButton, IonIcon, IonSpinner, IonText, IonNote],
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Datos del formulario, enlazados con [(ngModel)].
  usuario = '';
  clave = '';

  // Estado de la pantalla.
  readonly cargando = signal(false);
  readonly error = signal('');

  constructor() {
    addIcons({ storefront });
  }

  /**
   * Valida el formulario e inicia sesión.
   */
  async ingresar(): Promise<void> {
    this.error.set('');

    // Validación: ambos campos son obligatorios.
    if (!this.usuario.trim() || !this.clave) {
      this.error.set('Ingrese el usuario y la contraseña.');
      return;
    }

    this.cargando.set(true);
    try {
      await this.auth.login(this.usuario.trim(), this.clave);
      // replaceUrl: el usuario no puede volver al login con el botón atrás.
      await this.router.navigateByUrl('/tabs/productos', { replaceUrl: true });
    } catch (e: any) {
      // 400: credenciales incorrectas; 0: sin conexión con el servidor.
      this.error.set(
        e?.status === 0
          ? 'No hay conexión con el servidor. Verifique su internet.'
          : 'Usuario o contraseña incorrectos.',
      );
    } finally {
      this.cargando.set(false);
    }
  }
}