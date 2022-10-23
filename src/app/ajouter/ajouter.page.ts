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
  }

  ionViewDidEnter() {
    const date = new Date(Date.now());
    this.dateSelect.el.value =
      date.getFullYear() + '-' +
      ((date.getMonth() < 10) ? '0' + date.getMonth() : date.getMonth()) + '-' +
      ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate());
  }

  envoyer() {
    const objMessage: MessageModel = {
      date: Date.now().toString(),
      message: this.message,
      auteur: this.nom + ' ' + this.date.match(/[0-9]{4}/g)[0].replace('0', 'k')
    }

    lastValueFrom(this.httpService.addMessage(this.nomServeur, objMessage))
      .then(res => {
        this.display.display({'code': 'Message ajouté', 'color': 'success'}).then();
        this.message = '';
        this.nom = '';
        this.ionViewDidEnter();
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
