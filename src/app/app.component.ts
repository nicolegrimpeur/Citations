import {Component} from '@angular/core';
import {StorageService} from "./core/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router,
              private storageService: StorageService) {
    window.addEventListener('load', this.modifRouterOutlet);
    window.addEventListener('resize', this.modifRouterOutlet);
    this.checkServeur().then();
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
