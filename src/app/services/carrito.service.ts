/**
 * carrito.service.ts
 * Servicio del carrito de compras. Maneja los productos agregados, calcula los
 * totales, guarda el carrito en el almacenamiento local y confirma el pedido en la API.
 */
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { ItemCarrito, Pedido, Producto } from '../models/tienda.models';
import { StorageService } from './storage.service';

// Claves del almacenamiento local.
const CLAVE_CARRITO = 'carrito';
const CLAVE_PEDIDOS = 'pedidos';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  // Productos que están en el carrito.
  readonly items = signal<ItemCarrito[]>([]);

  // Historial de pedidos confirmados.
  readonly pedidos = signal<Pedido[]>([]);

  // Cantidad total de unidades (se muestra en el contador de la pestaña).
  readonly cantidadTotal = computed(() => this.items().reduce((suma, item) => suma + item.cantidad, 0));

  // Valor total del carrito.
  readonly total = computed(() =>
    this.items().reduce((suma, item) => suma + item.producto.price * item.cantidad, 0),
  );

  /**
   * Carga el carrito y los pedidos guardados en el dispositivo.
   */
  async cargar(): Promise<void> {
    this.items.set((await this.storage.obtener<ItemCarrito[]>(CLAVE_CARRITO)) ?? []);
    this.pedidos.set((await this.storage.obtener<Pedido[]>(CLAVE_PEDIDOS)) ?? []);
  }

  /**
   * Agrega un producto al carrito. Si ya estaba, aumenta su cantidad
   * sin superar las unidades disponibles (stock).
   * @param producto producto que se agrega.
   */
  async agregar(producto: Producto): Promise<void> {
    const existe = this.items().find((item) => item.producto.id === producto.id);
    if (existe) {
      await this.cambiarCantidad(producto.id, 1);
      return;
    }
    this.items.update((items) => [...items, { producto, cantidad: 1 }]);
    await this.guardarCarrito();
  }

  /**
   * Suma o resta unidades de un producto. Si la cantidad llega a 0, lo elimina.
   * @param id identificador del producto.
   * @param cambio +1 para sumar o -1 para restar.
   */
  async cambiarCantidad(id: number, cambio: number): Promise<void> {
    this.items.update((items) =>
      items
        .map((item) =>
          item.producto.id === id
            ? { ...item, cantidad: Math.min(item.cantidad + cambio, item.producto.stock) }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    );
    await this.guardarCarrito();
  }

  /**
   * Elimina un producto del carrito.
   * @param id identificador del producto.
   */
  async eliminar(id: number): Promise<void> {
    this.items.update((items) => items.filter((item) => item.producto.id !== id));
    await this.guardarCarrito();
  }

  /**
   * Vacía el carrito.
   */
  async vaciar(): Promise<void> {
    this.items.set([]);
    await this.guardarCarrito();
  }

  /**
   * Confirma el pedido: lo envía a la API (POST /carts/add), lo guarda en el
   * historial local y vacía el carrito.
   * @param idUsuario usuario que realiza la compra.
   * @returns el pedido registrado.
   */
  async confirmarPedido(idUsuario: number): Promise<Pedido> {
    const respuesta = await firstValueFrom(
      this.http.post<{ id: number; total: number }>(`${environment.apiUrl}/carts/add`, {
        userId: idUsuario,
        products: this.items().map((item) => ({ id: item.producto.id, quantity: item.cantidad })),
      }),
    );

    const pedido: Pedido = {
      id: respuesta.id,
      fecha: new Date().toISOString(),
      items: this.items(),
      total: this.total(),
    };

    // El pedido nuevo queda de primero en el historial.
    this.pedidos.update((pedidos) => [pedido, ...pedidos]);
    await this.storage.guardar(CLAVE_PEDIDOS, this.pedidos());
    await this.vaciar();
    return pedido;
  }

  /**
   * Guarda el carrito en el almacenamiento local para conservarlo al cerrar la app.
   */
  private async guardarCarrito(): Promise<void> {
    await this.storage.guardar(CLAVE_CARRITO, this.items());
  }
}