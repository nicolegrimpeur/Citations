import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Messages} from "../../../class/messages";
import {Serveur} from "../../../class/serveur";
import {HttpService} from "../../../../core/http.service";
import {Router} from "@angular/router";
import {StorageService} from "../../../../core/storage.service";
import {Display} from "../../../class/display";
import {MessageModel} from "../../../models/message.model";
import arrayShuffle from "array-shuffle";

@Component({
  selector: 'app-jeu',
  templateUrl: './jeu.component.html',
  styleUrls: ['./jeu.component.scss'],
})
export class JeuComponent implements OnInit {
  @Input('listeParticipants') participants: Array<string> = [];
  public compteur: number = 0;
  public serveur: Serveur;
  public listeMessages: Array<MessageModel> = [];
  public messages: Messages;
  public listeParticipants: Array<{ nom: string, points: number }> = [];
  public afficheResultat: boolean = false;

  constructor(
    private storageService: StorageService,
    private httpService: HttpService,
    private display: Display,
    private router: Router,
  ) {
    this.serveur = new Serveur(storageService, httpService, display, router);
    this.serveur.initNomServeur()
      .then(res => {
        this.messages = new Messages(storageService, httpService, display, router);
        this.messages.setNomServeur(res);
        this.messages.getListeMessages()
          .then(res => {
            this.listeMessages = arrayShuffle(this.messages.listeMessages);
          });
      });
  }

  ngOnInit() {
    // init liste participants
    this.participants.forEach(participant => {
      this.listeParticipants.push({nom: participant, points: 0});
    });
  }

  // tri par points
  sortParticipants() {
    this.listeParticipants.sort((a, b) => {
      return b.points - a.points;
    });
  }

  suivant() {
    this.compteur++;
    this.afficheResultat = false;

    const tabCheckboxes = document.querySelectorAll('ion-checkbox');
    tabCheckboxes.forEach(checkbox => {
      checkbox['checked'] = false;
    });

    if (this.compteur >= this.listeMessages.length) {
      this.listeMessages = arrayShuffle(this.listeMessages);
      this.compteur = 0;
    }
  }

  modifyPoints($event: any, participant: {nom: string; points: number}) {
    participant.points = $event.detail.checked ? participant.points + 1 : participant.points - 1;
    this.sortParticipants();
  }
}
