/**
 * red.service.ts
 * Servicio que detecta si el dispositivo tiene conexión a internet, usando el
 * plugin Network de Capacitor. Permite avisar al usuario cuando está sin conexión.
 */
import { Injectable, signal } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root',
})
export class RedService {
  // true cuando hay conexión a internet.
  readonly enLinea = signal(true);

  constructor() {
    // Estado inicial de la conexión.
    Network.getStatus().then((estado) => this.enLinea.set(estado.connected));

    // Se escucha cada cambio de conexión (por ejemplo, al activar el modo avión).
    Network.addListener('networkStatusChange', (estado) => this.enLinea.set(estado.connected));
  }
}