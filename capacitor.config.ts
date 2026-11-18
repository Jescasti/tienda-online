/**
 * capacitor.config.ts
 * Configuración de Capacitor para generar las apps nativas de Android e iOS.
 */
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Identificador único de la app en Play Store y App Store (dominio invertido).
  appId: 'co.edu.ucompensar.tiendaonline',

  // Nombre visible de la app en el dispositivo.
  appName: 'Tienda Online',

  // Carpeta con la app web compilada (ionic build) que se copia a Android e iOS.
  webDir: 'www',

  // Configuración de los plugins de Capacitor.
  plugins: {
    // Preferences: almacenamiento local de la sesión, el carrito y los pedidos.
    Preferences: {},
    // Network: detección del estado de la conexión a internet.
    Network: {},
  },
};

export default config;