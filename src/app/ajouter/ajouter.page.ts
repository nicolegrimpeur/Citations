import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-ajouter',
  templateUrl: './ajouter.page.html',
  styleUrls: ['./ajouter.page.scss'],
})
export class AjouterPage implements OnInit {
  @ViewChild("dateSelect") dateSelect;

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    const date = new Date(Date.now());
    this.dateSelect.el.value =
      date.getFullYear() + '-' +
      ((date.getMonth() < 10) ? '0' + date.getMonth() : date.getMonth()) + '-' +
      ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate());
  }
}
