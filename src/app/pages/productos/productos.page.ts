/**
 * productos.page.ts
 * Catálogo de la tienda (pestaña 1). Consume la API de productos y permite
 * buscar, filtrar por categoría y agregar productos al carrito.
 */
import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cartOutline, cloudOfflineOutline, star } from 'ionicons/icons';

import { Categoria, Producto } from '../../models/tienda.models';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';
import { RedService } from '../../services/red.service';

@Component({
  selector: 'app-productos',
  templateUrl: 'productos.page.html',
  styleUrls: ['productos.page.scss'],
  imports: [
    CurrencyPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonChip,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class ProductosPage implements OnInit {
  private productoService = inject(ProductoService);
  private carrito = inject(CarritoService);
  private toast = inject(ToastController);
  readonly red = inject(RedService);

  // Estado de la página.
  readonly productos = signal<Producto[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly categoriaActual = signal<string>('');
  readonly cargando = signal(true);
  readonly error = signal('');

  constructor() {
    addIcons({ cartOutline, star, cloudOfflineOutline });
  }

  /**
   * Al abrir la página se cargan las categorías y el catálogo.
   */
  async ngOnInit(): Promise<void> {
    await this.cargarCategorias();
    await this.cargarProductos();
  }

  /**
   * Trae las categorías de la API (se muestran las primeras 10 como filtros).
   */
  async cargarCategorias(): Promise<void> {
    try {
      this.categorias.set((await this.productoService.categorias()).slice(0, 10));
    } catch {
      this.categorias.set([]);
    }
  }

  /**
   * Trae los productos de la API según la categoría seleccionada.
   */
  async cargarProductos(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    try {
      const slug = this.categoriaActual();
      this.productos.set(slug ? await this.productoService.porCategoria(slug) : await this.productoService.listar());
    } catch {
      this.error.set('No fue posible cargar los productos. Verifique su conexión.');
    } finally {
      this.cargando.set(false);
    }
  }

  /**
   * Filtra el catálogo por categoría ('' muestra todos los productos).
   * @param slug categoría seleccionada.
   */
  async filtrar(slug: string): Promise<void> {
    this.categoriaActual.set(slug);
    await this.cargarProductos();
  }

  /**
   * Busca productos por texto mientras el usuario escribe.
   * @param evento evento del buscador con el texto escrito.
   */
  async buscar(evento: CustomEvent): Promise<void> {
    const texto = (evento.detail.value ?? '').trim();
    this.categoriaActual.set('');
    if (!texto) {
      await this.cargarProductos();
      return;
    }
    this.cargando.set(true);
    try {
      this.productos.set(await this.productoService.buscar(texto));
    } catch {
      this.error.set('No fue posible realizar la búsqueda.');
    } finally {
      this.cargando.set(false);
    }
  }

  /**
   * Recarga el catálogo al deslizar la lista hacia abajo (pull to refresh).
   */
  async refrescar(evento: CustomEvent): Promise<void> {
    await this.cargarProductos();
    (evento.target as HTMLIonRefresherElement).complete();
  }

  /**
   * Agrega un producto al carrito y muestra un mensaje de confirmación.
   * @param producto producto seleccionado.
   */
  async agregar(producto: Producto): Promise<void> {
    await this.carrito.agregar(producto);
    const aviso = await this.toast.create({
      message: `${producto.title} agregado al carrito`,
      duration: 1500,
      position: 'bottom',
      color: 'success',
    });
    await aviso.present();
  }
}