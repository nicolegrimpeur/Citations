import {Component, OnInit, ViewChild} from '@angular/core';
import {MessageModel} from "../shared/models/message.model";
import {lastValueFrom} from "rxjs";
import {HttpService} from "../core/http.service";
import {StorageService} from "../core/storage.service";
import {Display} from "../shared/class/display";

@Component({
  selector: 'app-ajouter',
  templateUrl: './ajouter.page.html',
  styleUrls: ['./ajouter.page.scss'],
})
export class AjouterPage implements OnInit {
  @ViewChild("dateSelect") dateSelect;
  public nom: string;
  public date: string;
  public message: string;
  private nomServeur: string;

  constructor(
    private display: Display,
    private storageService: StorageService,
    private httpService: HttpService
    ) {
    this.nom = "";
    this.message = "";

    this.storageService.getServeur()
      .then(res => {
        this.nomServeur = res;
      })
      .catch(() => {
        this.nomServeur = '';
      })
  }

  ngOnInit() {
    this.date = new Date().toISOString();
  }

  envoyer() {
    if (this.nom === '' || this.message === '') {
      this.display.display('Veuillez remplir tous les champs').then();
    } else {
      const objMessage: MessageModel = {
        date: this.date,
        message: this.message,
        auteur: this.nom
      };

      lastValueFrom(this.httpService.addMessage(this.nomServeur, objMessage))
        .then(res => {
          this.display.display({'code': 'Message ajouté', 'color': 'success'}).then();
          this.message = '';
          this.nom = '';
        })
        .catch(err => {
          if (err.status === 406)
            this.display.display('Le serveur n\'existe pas').then();
          else if (err.status === 0)
            this.display.display('Serveur distant indisponible').then();
          else
            this.display.display('Une erreur a eu lieu').then();
        })
    }
  }
}
