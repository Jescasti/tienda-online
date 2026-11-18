/**
 * perfil.page.ts
 * Perfil del usuario (pestaña 3). Consulta los datos del usuario en una ruta
 * protegida de la API (requiere el token), muestra el historial de pedidos
 * guardado localmente y permite cerrar la sesión.
 */
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOutOutline, receiptOutline } from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-perfil',
  templateUrl: 'perfil.page.html',
  styleUrls: ['perfil.page.scss'],
  imports: [
    CurrencyPipe,
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonAvatar,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
    IonIcon,
  ],
})
export class PerfilPage implements OnInit {
  readonly auth = inject(AuthService);
  readonly carrito = inject(CarritoService);
  private alerta = inject(AlertController);
  private router = inject(Router);

  constructor() {
    addIcons({ logOutOutline, receiptOutline });
  }

  /**
   * Actualiza los datos del usuario desde la API (GET /auth/me con el token).
   * Si no hay conexión, se muestran los datos guardados localmente.
   */
  async ngOnInit(): Promise<void> {
    try {
      await this.auth.obtenerPerfil();
    } catch {
      // Sin conexión: se conservan los datos del almacenamiento local.
    }
  }

  /**
   * Pide confirmación, cierra la sesión y vuelve al login.
   */
  async cerrarSesion(): Promise<void> {
    const confirmacion = await this.alerta.create({
      header: 'Cerrar sesión',
      message: '¿Desea cerrar la sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          role: 'destructive',
          handler: async () => {
            await this.auth.logout();
            await this.router.navigateByUrl('/login', { replaceUrl: true });
          },
        },
      ],
    });
    await confirmacion.present();
  }
}