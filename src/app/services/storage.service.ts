/**
 * storage.service.ts
 * Servicio de almacenamiento local. Usa el plugin Preferences de Capacitor, que
 * guarda pares clave-valor en el dispositivo (SharedPreferences en Android,
 * UserDefaults en iOS y localStorage en el navegador).
 */
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Guarda un valor convirtiéndolo a texto JSON.
   * @param clave nombre con el que se guarda el dato.
   * @param valor dato que se va a guardar (objeto, arreglo, texto o número).
   */
  async guardar<T>(clave: string, valor: T): Promise<void> {
    await Preferences.set({ key: clave, value: JSON.stringify(valor) });
  }

  /**
   * Lee un valor guardado y lo convierte de JSON a su tipo original.
   * @param clave nombre del dato.
   * @returns el dato guardado o null si no existe.
   */
  async obtener<T>(clave: string): Promise<T | null> {
    const { value } = await Preferences.get({ key: clave });
    return value ? (JSON.parse(value) as T) : null;
  }

  /**
   * Elimina un dato del almacenamiento local.
   * @param clave nombre del dato que se va a borrar.
   */
  async eliminar(clave: string): Promise<void> {
    await Preferences.remove({ key: clave });
  }
}