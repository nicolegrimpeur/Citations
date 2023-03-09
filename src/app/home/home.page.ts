import {Component, ViewChild} from '@angular/core';
import {StorageService} from "../core/storage.service";
import {HttpService} from "../core/http.service";
import {lastValueFrom} from "rxjs";
import {Display} from "../shared/class/display";
import {MessageModel} from "../shared/models/message.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild("refresh") refreshElement;

  public nomServeur: string;
  public liste: Array<MessageModel>;
  public favoris: Array<string>;

  constructor(
    private storageService: StorageService,
    private httpService: HttpService,
    private display: Display,
    private router: Router
  ) {
    this.favoris = [];
  }

  async ionViewWillEnter() {
    this.storageService.getServeur()
      .then(res => {
        if (res === '' || res === null)
          this.router.navigate(['/login']).then();
        else {
          this.nomServeur = res;
          this.getMessages();
        }
      })
      .catch(() => {
        this.nomServeur = '';
        this.router.navigate(['/login']).then();
      });

    this.favoris = await this.storageService.getFavoris();

    if (this.favoris === null) {
      this.favoris = [];
      this.storageService.setFavoris(this.favoris).then();
    }
  }

  clickFavoris() {
    if (!this.favoris.includes(this.nomServeur)) {
      this.favoris.push(this.nomServeur);
      this.storageService.setFavoris(this.favoris)
        .then(() => {
          this.display.display({'code': 'Serveur ajouté aux favoris', 'color': 'success'}).then();
        })
        .catch(() => {
          this.display.display('Une erreur a eu lieu').then();
        });
    } else {
      this.favoris = this.favoris.filter(favori => favori !== this.nomServeur);
      this.storageService.setFavoris(this.favoris)
        .then(() => {
          this.display.display({'code': 'Serveur supprimé des favoris', 'color': 'success'}).then();
        })
        .catch(() => {
          this.display.display('Une erreur a eu lieu').then();
        });
    }



  }

  getMessages() {
    lastValueFrom(this.httpService.getServeur(this.nomServeur))
      .then(res => {
        this.liste = res.messages.reverse();
      })
      .catch(err => {
        if (err.status === 406)
          this.display.display('Le serveur n\'existe pas').then();
        else if (err.status === 0)
          this.display.display('Serveur distant indisponible').then();
        else
          this.router.navigate(['/login']).then();
      })
  }

  editNomServeur() {
    this.display.alertWithInputs('Renommer le serveur', [
      {
        name: 'nom',
        type: 'text',
        placeholder: 'Nouveau nom'
      }
    ])
      .then(res => {
        if (res.role !== 'cancel')
          lastValueFrom(this.httpService.renameServeur(this.nomServeur, res.data.values.nom))
            .then(resultat => {
              this.storageService.setServeur(res.data.values.nom).then(() => {
                this.nomServeur = res.data.values.nom;
                this.display.display({'code': 'Serveur renommé', 'color': 'success'}).then();
                this.getMessages();
              });

            })
            .catch(err => {
              this.display.display('Une erreur a eu lieu').then();
            })
      })
  }

  supprimerMessage(date) {
    this.display.alertWithInputs("Etes-vous sur de vouloir vous supprimer ce message ?", [])
      .then(res => {
        if (res.role === 'ok')
          lastValueFrom(this.httpService.removeMessage(this.nomServeur, date))
            .then(res => {
              this.getMessages();
              this.display.display({'code': 'Suppression réussi', 'color': 'success'}).then();
            })
            .catch(() => {
              this.display.display('Une erreur a eu lieu').then();
            })
      });
  }

  supprimerServeur() {
    this.display.alertWithInputs("Etes-vous sur de vouloir vous supprimer ce serveur ?", [])
      .then(res => {
        if (res.role === 'ok')
          lastValueFrom(this.httpService.suppServeur(this.nomServeur))
            .then(res => {
              this.storageService.setServeur('')
                .then(() => {
                  this.router.navigate(['/login']).then(() => {
                    this.display.display({'code': 'Suppression réussi', 'color': 'success'}).then();
                  });
                })
            })
            .catch(() => {
              this.display.display('Une erreur a eu lieu').then();
            })
      });
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
    this.getMessages();

    setTimeout(() => {
      // permet de terminer l'animation
      event.target.complete();
    }, 1000);
  }
}
