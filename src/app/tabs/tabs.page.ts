/**
 * tabs.page.ts
 * Contenedor de las pestañas de la tienda (Productos, Carrito y Perfil).
 * Al iniciar carga el carrito y los pedidos guardados en el dispositivo.
 */
import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonBadge, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cart, person, storefront } from 'ionicons/icons';

import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  // Público para mostrar la cantidad de unidades en el contador de la pestaña.
  readonly carrito = inject(CarritoService);

  constructor() {
    // Íconos de las pestañas.
    addIcons({ storefront, cart, person });
    // Recupera el carrito y el historial de pedidos del almacenamiento local.
    this.carrito.cargar();
  }
}