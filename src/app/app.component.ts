import {Component} from '@angular/core';
import {StorageService} from "./core/storage.service";
import {Router} from "@angular/router";
import {App} from "@capacitor/app";
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router,
              public platform: Platform,
              private storageService: StorageService) {
    window.addEventListener('load', this.modifRouterOutlet);
    window.addEventListener('resize', this.modifRouterOutlet);
    this.checkServeur().then();


    // gestion de la touche mobile back
    this.platform.backButton.subscribeWithPriority(-1, () => {
      console.log(router.url)
      // si l'on est sur la page principale, on quitte l'application
      if (this.router.url === '/home' || this.router.url === '/login') {
        App.exitApp().then();
      } else if (this.router.url === '/ajouter') {  // si on est sur la page de liste, on va sur la page principale
        this.router.navigate(['/home']).then();
      } else {  // sinon c'est que l'on est sur la page de login donc on peut quitter l'appli
        App.exitApp().then();
      }
    });
  }

  // passe la page en taille pleine pour passer en dessous du tabs
  modifRouterOutlet() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  async checkServeur() {
    await this.storageService.getServeur()
      .then(result => {
        if (result === null) {
          this.storageService.setServeur('').then();
        } else if (result === '') {
          this.router.navigate(['/login']).then();
        } else {
          this.router.navigate(['/home']).then();
        }
      })
      .catch(() => {
        this.router.navigate(['/login']).then();
      });
  }
}
