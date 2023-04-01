import {Injectable} from "@angular/core";
import {lastValueFrom} from "rxjs";
import {HttpService} from "../../core/http.service";
import {Router} from "@angular/router";
import {StorageService} from "../../core/storage.service";
import {Display} from "./display";

@Injectable({
  providedIn: 'root'
})

export class Serveur {

  public nomServeur: string;

  constructor(
    private storageService: StorageService,
    private httpService: HttpService,
    private display: Display,
    private router: Router
  ) {
  }

  async initNomServeur() {
    return new Promise<string>((resolve, reject) => {
      this.storageService.getServeur()
        .then(res => {
          if (res === '' || res === null) {
            this.router.navigate(['/login']).then();
            reject();
          } else {
            this.nomServeur = res;
            resolve(res);
          }
        })
        .catch(() => {
          this.nomServeur = '';
          this.router.navigate(['/login']).then();
          reject();
        });
    });
  }

  public setNomServeur(nomServeur: string) {
    this.nomServeur = nomServeur;
  }

  public getNomServeur(): string {
    return this.nomServeur;
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
          lastValueFrom(this.httpService.renameServeur(this.getNomServeur(), res.data.values.nom))
            .then(resultat => {
              this.storageService.setServeur(res.data.values.nom).then(() => {
                this.setNomServeur(res.data.values.nom);
                this.display.display({'code': 'Serveur renommé', 'color': 'success'}).then();
              });
            })
            .catch(err => {
              this.display.display('Une erreur a eu lieu').then();
            })
      })
  }

  supprimerServeur() {
    this.display.alertWithInputs("Etes-vous sur de vouloir vous supprimer ce serveur ?", [])
      .then(res => {
        if (res.role === 'ok')
          lastValueFrom(this.httpService.suppServeur(this.getNomServeur()))
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
}
