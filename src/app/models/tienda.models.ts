/**
 * tienda.models.ts
 * Modelos de datos (interfaces) que usa la tienda online.
 * Definen la forma de la información que llega de la API y la que se guarda localmente.
 */

/** Producto del catálogo, tal como lo entrega la API. */
export interface Producto {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
}

/** Respuesta de la API cuando se consulta una lista de productos. */
export interface RespuestaProductos {
  products: Producto[];
  total: number;
  skip: number;
  limit: number;
}

/** Categoría de productos. */
export interface Categoria {
  slug: string;
  name: string;
}

/** Usuario autenticado. */
export interface Usuario {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

/** Respuesta del servicio de login: datos del usuario más el token JWT. */
export interface RespuestaLogin extends Usuario {
  accessToken: string;
  refreshToken: string;
}

/** Producto agregado al carrito con la cantidad elegida. */
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

/** Pedido confirmado que se guarda en el historial local. */
export interface Pedido {
  id: number;
  fecha: string;
  items: ItemCarrito[];
  total: number;
}