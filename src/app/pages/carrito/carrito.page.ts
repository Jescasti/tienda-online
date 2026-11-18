/**
 * carrito.page.ts
 * Carrito de compras (pestaña 2). Muestra los productos agregados, permite
 * cambiar cantidades, eliminar productos y confirmar el pedido.
 */
import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircleOutline, cartOutline, removeCircleOutline, trashOutline } from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { RedService } from '../../services/red.service';

@Component({
  selector: 'app-carrito',
  templateUrl: 'carrito.page.html',
  styleUrls: ['carrito.page.scss'],
  imports: [
    CurrencyPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonButton,
    IonIcon,
    IonFooter,
    IonSpinner,
  ],
})
export class CarritoPage {
  readonly carrito = inject(CarritoService);
  readonly red = inject(RedService);
  private auth = inject(AuthService);
  private alerta = inject(AlertController);
  private toast = inject(ToastController);

  // true mientras se envía el pedido a la API.
  readonly enviando = signal(false);

  constructor() {
    addIcons({ addCircleOutline, removeCircleOutline, trashOutline, cartOutline });
  }

  /**
   * Pide confirmación antes de vaciar el carrito.
   */
  async vaciar(): Promise<void> {
    const confirmacion = await this.alerta.create({
      header: 'Vaciar carrito',
      message: '¿Desea eliminar todos los productos del carrito?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Vaciar', role: 'destructive', handler: () => this.carrito.vaciar() },
      ],
    });
    await confirmacion.present();
  }

  /**
   * Pide confirmación y envía el pedido a la API.
   */
  async confirmar(): Promise<void> {
    const confirmacion = await this.alerta.create({
      header: 'Confirmar pedido',
      message: `Total a pagar: ${this.carrito.total().toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Confirmar', handler: () => this.enviarPedido() },
      ],
    });
    await confirmacion.present();
  }

  /**
   * Envía el pedido y muestra el resultado.
   */
  private async enviarPedido(): Promise<void> {
    this.enviando.set(true);
    try {
      const pedido = await this.carrito.confirmarPedido(this.auth.usuario()?.id ?? 1);
      await this.mostrarMensaje(`Pedido #${pedido.id} confirmado con éxito`, 'success');
    } catch {
      await this.mostrarMensaje('No fue posible enviar el pedido. Intente de nuevo.', 'danger');
    } finally {
      this.enviando.set(false);
    }
  }

  /**
   * Muestra un mensaje temporal en la parte inferior.
   */
  private async mostrarMensaje(mensaje: string, color: string): Promise<void> {
    const aviso = await this.toast.create({ message: mensaje, duration: 2500, color });
    await aviso.present();
  }
}