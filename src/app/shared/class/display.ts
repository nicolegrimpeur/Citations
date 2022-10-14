import {AlertController, ToastController} from '@ionic/angular';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Display {
  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {
  }

  // affiche d'un toast contenant le texte de l'erreur
  // message peut être égal à
  // 'info'
  // ou {code: 'info', color: 'color'}
  async display(message: any) {
    let strMessage = message;
    let couleur = 'danger';

    // si l'on donne une couleur dans l'erreur
    if (message.color !== undefined) {
      strMessage = message.code;
      couleur = message.color;
    }

    // création du toast
    const toast = await this.toastController.create({
      message: strMessage,
      duration: 2000,
      position: 'top',
      color: couleur
    });
    // affichage du toast
    await toast.present();
  }

  // création d'une alerte
  async alert(header: string, info: string) {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: header,
      message: info,
      buttons: ['OK']
    });

    await alert.present();
  }

  async alertWithInputs(header: string, inputs) {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: header,
      inputs: inputs,
      buttons: [{
        text: 'Annuler',
        role: 'cancel'
      }, {
        text: 'Ok',
        role: 'ok'
      }]
    });

    // on affiche l'alerte
    await alert.present();

    // on attend que l'utilisateur supprime l'alerte
    return await alert.onDidDismiss().then(result => result);
  }
}
