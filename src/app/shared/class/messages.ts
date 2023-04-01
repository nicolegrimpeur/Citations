import {Injectable} from "@angular/core";
import {MessageModel} from "../models/message.model";
import {HttpService} from "../../core/http.service";
import {StorageService} from "../../core/storage.service";
import {Display} from "./display";
import {Router} from "@angular/router";
import {lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class Messages {

  public nomServeur: string;
  public listeMessages: Array<MessageModel> = [];

  constructor(
    nomServeur: string,
    private storageService: StorageService,
    private httpService: HttpService,
    private display: Display,
    private router: Router) {
    this.nomServeur = nomServeur;
  }

  async getListeMessages() {
    await lastValueFrom(this.httpService.getServeur(this.nomServeur))
      .then(res => {
        this.listeMessages = res.messages.reverse();
        this.listeMessages.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
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

  supprimerMessage(date) {
    this.display.alertWithInputs("Etes-vous sur de vouloir vous supprimer ce message ?", [])
      .then(res => {
        if (res.role === 'ok')
          lastValueFrom(this.httpService.removeMessage(this.nomServeur, date))
            .then(res => {
              this.getListeMessages().then(() => {
                  this.display.display({'code': 'Suppression réussi', 'color': 'success'}).then();
                }
              );
            })
            .catch(() => {
              this.display.display('Une erreur a eu lieu').then();
            })
      });
  }
}
