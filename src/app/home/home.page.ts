import {Component, Input, ViewChild} from '@angular/core';
import {StorageService} from "../core/storage.service";
import {HttpService} from "../core/http.service";
import {lastValueFrom} from "rxjs";
import {Display} from "../shared/class/display";
import {MessageModel} from "../shared/models/message.model";
import {Router} from "@angular/router";
import {Serveur} from "../shared/class/serveur";
import {Messages} from "../shared/class/messages";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild("refresh") refreshElement;

  public favoris: Array<string>;
  public serveur: Serveur;
  public messages: Messages;

  constructor(
    private storageService: StorageService,
    private httpService: HttpService,
    private display: Display,
    private router: Router,
  ) {
    this.favoris = [];
    this.serveur = new Serveur(storageService, httpService, display, router);
    this.serveur.initNomServeur()
      .then(res => {
        this.messages = new Messages(storageService, httpService, display, router);
        this.messages.setNomServeur(res);
        this.messages.getListeMessages().then();
        this.initFavoris().then();
      });
  }

  ionViewWillEnter() {
    if (this.messages)
      this.messages.getListeMessages().then();
  }

  async initFavoris() {
    this.favoris = await this.storageService.getFavoris();

    if (this.favoris === null) {
      this.favoris = [];
      this.storageService.setFavoris(this.favoris).then();
    }
  }

  clickFavoris() {
    if (!this.favoris.includes(this.serveur.nomServeur)) {
      this.favoris.push(this.serveur.nomServeur);
      this.storageService.setFavoris(this.favoris)
        .then(() => {
          this.display.display({'code': 'Serveur ajouté aux favoris', 'color': 'success'}).then();
        })
        .catch(() => {
          this.display.display('Une erreur a eu lieu').then();
        });
    } else {
      this.favoris = this.favoris.filter(favori => favori !== this.serveur.nomServeur);
      this.storageService.setFavoris(this.favoris)
        .then(() => {
          this.display.display({'code': 'Serveur supprimé des favoris', 'color': 'success'}).then();
        })
        .catch(() => {
          this.display.display('Une erreur a eu lieu').then();
        });
    }
  }

  deconnexion() {
    this.display.alertWithInputs("Etes-vous sur de vouloir vous déconnecter ?", [])
      .then(res => {
        if (res.role === 'ok')
          this.storageService.setServeur('')
            .then(() => {
              this.router.navigate(['/login']).then(() => {
                this.display.display({'code': 'Déconnexion réussi', 'color': 'success'}).then();
              });
            })
      });
  }

  // événement pour rafraichir la page
  doRefresh(event) {
    // rafraichi les messages
    this.messages.getListeMessages().then(
      () => {
        // permet de terminer l'animation
        event.target.complete();
      }
    );
  }
}
