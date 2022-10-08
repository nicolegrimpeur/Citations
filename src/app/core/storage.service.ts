import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  async setServeur(serveur: string) {
    await Preferences.set({
      key: 'serveur',
      value: serveur
    });
  }

  async getServeur() {
    const {value} = await Preferences.get({key: 'serveur'});
    return value;
  }
}
