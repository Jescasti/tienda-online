/**
 * producto.service.ts
 * Servicio que consume la API REST de productos (catálogo, categorías,
 * búsqueda y detalle).
 */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Categoria, Producto, RespuestaProductos } from '../models/tienda.models';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/products`;

  /**
   * Obtiene el catálogo de productos (GET /products).
   * @param limite cantidad máxima de productos a traer.
   */
  async listar(limite = 30): Promise<Producto[]> {
    const r = await firstValueFrom(this.http.get<RespuestaProductos>(`${this.api}?limit=${limite}`));
    return r.products;
  }

  /**
   * Obtiene las categorías disponibles (GET /products/categories).
   */
  async categorias(): Promise<Categoria[]> {
    return firstValueFrom(this.http.get<Categoria[]>(`${this.api}/categories`));
  }

  /**
   * Obtiene los productos de una categoría (GET /products/category/{slug}).
   * @param slug identificador de la categoría.
   */
  async porCategoria(slug: string): Promise<Producto[]> {
    const r = await firstValueFrom(this.http.get<RespuestaProductos>(`${this.api}/category/${slug}`));
    return r.products;
  }

  /**
   * Busca productos por texto (GET /products/search?q=).
   * @param texto palabra a buscar.
   */
  async buscar(texto: string): Promise<Producto[]> {
    const r = await firstValueFrom(
      this.http.get<RespuestaProductos>(`${this.api}/search?q=${encodeURIComponent(texto)}`),
    );
    return r.products;
  }

  /**
   * Obtiene el detalle de un producto (GET /products/{id}).
   * @param id identificador del producto.
   */
  async detalle(id: number): Promise<Producto> {
    return firstValueFrom(this.http.get<Producto>(`${this.api}/${id}`));
  }
}