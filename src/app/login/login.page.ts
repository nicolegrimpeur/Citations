import {Component, OnInit} from '@angular/core';
import {HttpService} from '../core/http.service';
import {lastValueFrom} from 'rxjs';
import {Display} from '../shared/class/display';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public serveur: string;
  public newServeur: string;

  constructor(
    private httpService: HttpService,
    private display: Display) {
  }

  ngOnInit() {
  }

  clickCreer() {
    lastValueFrom(this.httpService.isServerExisting(this.newServeur))
      .then(res => {
        this.display.display('Ce serveur existe déjà').then();
      })
      .catch(err => {
        if (err.status === 409)
          lastValueFrom(this.httpService.initServeur(this.newServeur))
            .then(res => {
              this.display.display({'code': 'Création réussi', 'color': 'success'}).then();
            })
            .catch(err => {
              this.display.display('Une erreur a eu lieu').then();
            })
      });
  }
}
