# Tienda Online – App móvil híbrida

Aplicación móvil híbrida de una tienda online desarrollada con **Ionic 9 + Angular 22 + Capacitor 8**, para Android e iOS.
Proyecto ABP de la asignatura Desarrollo de Aplicaciones Híbridas – Fundación Universitaria U Compensar.

## Funcionalidades
- **Autenticación:** inicio de sesión contra la API con token JWT, interceptor HTTP que envía el token y guards que protegen las rutas.
- **Servicios API:** catálogo, categorías, búsqueda y detalle de productos; perfil del usuario y registro de pedidos (API REST DummyJSON).
- **Carrito de compras:** agregar, cambiar cantidades, eliminar, total y confirmación del pedido.
- **Almacenamiento local:** sesión, carrito e historial de pedidos con Capacitor Preferences.
- **Estado de la red:** aviso sin conexión con Capacitor Network.

## Estructura
- `src/app/services`: servicios de autenticación, productos, carrito, almacenamiento y red.
- `src/app/interceptors`: interceptor que agrega el token JWT.
- `src/app/guards`: protección de rutas.
- `src/app/pages`: login, productos, detalle, carrito y perfil.
- `android/` y `ios/`: proyectos nativos generados con Capacitor.

## Ejecución
```bash
npm install
ionic serve            # navegador
ionic build
npx cap sync
npx cap open android   # Android Studio
npx cap open ios       # Xcode (requiere macOS)
```

Usuario de prueba: `emilys` · Contraseña: `emilyspass`

## Integrantes
- Jesús Castiblanco García
- Aldair Botache Muñoz