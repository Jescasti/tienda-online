/**
 * producto-detalle.page.ts
 * Detalle de un producto. Recibe el id por la ruta (/tabs/productos/:id),
 * consulta la API y permite agregar el producto al carrito.
 */
import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cartOutline, star } from 'ionicons/icons';

import { Producto } from '../../models/tienda.models';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: 'producto-detalle.page.html',
  styleUrls: ['producto-detalle.page.scss'],
  imports: [
    CurrencyPipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText,
  ],
})
export class ProductoDetallePage implements OnInit {
  private productoService = inject(ProductoService);
  private carrito = inject(CarritoService);
  private toast = inject(ToastController);

  // Parámetro :id de la ruta (lo entrega el router gracias a withComponentInputBinding).
  readonly id = input.required<string>();

  readonly producto = signal<Producto | null>(null);
  readonly error = signal('');

  constructor() {
    addIcons({ cartOutline, star });
  }

  /**
   * Consulta el detalle del producto en la API.
   */
  async ngOnInit(): Promise<void> {
    try {
      this.producto.set(await this.productoService.detalle(Number(this.id())));
    } catch {
      this.error.set('No fue posible cargar el producto.');
    }
  }

  /**
   * Agrega el producto al carrito y lo confirma con un mensaje.
   */
  async agregar(): Promise<void> {
    const producto = this.producto();
    if (!producto) {
      return;
    }
    await this.carrito.agregar(producto);
    const aviso = await this.toast.create({
      message: 'Producto agregado al carrito',
      duration: 1500,
      color: 'success',
    });
    await aviso.present();
  }
}