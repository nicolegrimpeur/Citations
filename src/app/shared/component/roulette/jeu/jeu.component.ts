import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-jeu',
  templateUrl: './jeu.component.html',
  styleUrls: ['./jeu.component.scss'],
})
export class JeuComponent  implements OnInit {
  @Input('listeParticipants') participants: Array<string> = [];
  @Output() childToParent = new EventEmitter<Array<string>>();

  constructor() { }

  ngOnInit() {}

  getFinJeu() {
    this.childToParent.emit();
  }
}
