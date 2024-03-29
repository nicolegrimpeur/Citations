import {Component, OnInit} from '@angular/core';
import {HttpService} from '../core/http.service';
import {lastValueFrom} from 'rxjs';
import {Display} from '../shared/class/display';
import {StorageService} from "../core/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public serveur: string;
  public newServeur: string;
  public favoris: Array<string>;

  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
    private router: Router,
    private display: Display) {
  }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.favoris = await this.storageService.getFavoris();

    if (this.favoris)
      this.favoris.reverse()
  }

  initVar() {
    this.serveur = '';
    this.newServeur = '';
  }

  clickRejoindre(serveur: string = '') {
    if (serveur === '')
      serveur = this.serveur;

    lastValueFrom(this.httpService.isServeurExisting(serveur))
      .then(res => {
        this.storageService.setServeur(serveur).then(() => {
          this.router.navigate(['/home']).then();
          window.location.reload();
          this.initVar();
        });
      })
      .catch(err => {
        if (err.status === 406)
          this.display.display('Ce serveur n\'existe pas, merci de le créer').then();
        else if (err.status === 0)
          this.display.display('Serveur distant indisponible').then();
      });
  }

  clickCreer() {
    lastValueFrom(this.httpService.isServeurExisting(this.newServeur))
      .then(res => {
        this.display.display('Ce serveur existe déjà').then();
      })
      .catch(err => {
        if (err.status === 406)
          lastValueFrom(this.httpService.initServeur(this.newServeur))
            .then(res => {
              this.display.display({'code': 'Création réussi', 'color': 'success'}).then();

              // stockage du nom de serveur et connexion
              console.log(this.newServeur)
              this.storageService.setServeur(this.newServeur).then(() => {
                this.router.navigateByUrl('/home').then();
                this.initVar();
              });
            })
            .catch(err => {
              this.display.display('Une erreur a eu lieu').then();
            })
      });
  }
}
