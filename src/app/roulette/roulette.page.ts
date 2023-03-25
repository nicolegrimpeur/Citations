import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.page.html',
  styleUrls: ['./roulette.page.scss'],
})
export class RoulettePage implements OnInit {
  @ViewChild('enregistrementComponent') enregistrement;
  public participants: Array<string> = [];
  public enJeu: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  clickButton() {
    this.enJeu = !this.enJeu;
    if (this.enregistrement)
      this.participants = this.enregistrement.participants;
  }
}
