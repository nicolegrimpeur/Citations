import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-enregistrement',
  templateUrl: './enregistrement.component.html',
  styleUrls: ['./enregistrement.component.scss'],
})
export class EnregistrementComponent implements OnInit {
  @Input('listeParticipants') participants: Array<string> = [];
  public nom: string = '';

  constructor() {
  }

  ngOnInit() {
  }

  addParticipant() {
    if (this.nom !== '') {
      this.participants.push(this.nom);
      this.nom = '';
    }
  }

  removeParticipant(participant: string) {
    this.participants = this.participants.filter(p => p !== participant);
  }

  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.addParticipant();
    }
  }
}
