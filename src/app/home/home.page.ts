import {Component, ViewChild} from '@angular/core';
import {StorageService} from "../core/storage.service";
import {HttpService} from "../core/http.service";
import {lastValueFrom} from "rxjs";
import {Display} from "../shared/class/display";
import {MessageModel} from "../shared/models/message.model";
import {Router} from "@angular/router";
import {Animation, AnimationController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild("refresh") refreshElement;

  public nomServeur: string;
  public liste: Array<MessageModel>;

  constructor(
    private storageService: StorageService,
    private httpService: HttpService,
    private display: Display,
    private router: Router,
    private animationCtrl: AnimationController
  ) {
    this.storageService.getServeur()
      .then(res => {
        this.nomServeur = res;
        this.getMessages();
      })
      .catch(() => {
        this.nomServeur = '';
      })
  }

  getMessages() {
    lastValueFrom(this.httpService.getServeur(this.nomServeur))
      .then(res => {
        console.log(res);
        this.liste = res.messages;
      })
      .catch(err => {
        if (err.status === 406)
          this.display.display('Le serveur n\'existe pas').then();
        else
          this.display.display('Une erreur a eu lieu').then();
      })
  }

  boutonRefresh() {
    this.lanceAnimation();
    this.getMessages();
  }

  lanceAnimation() {
    const animation: Animation = this.animationCtrl.create()
      .addElement(this.refreshElement.el)
      .duration(1000)
      .iterations(2)
      .fromTo('transform', 'rotate(0deg)', 'rotate(360deg)');
    // .fromTo('transform', 'translateX(0px)', 'translateX(-100px)');

    animation.play();
  }

  deconnexion() {
    this.storageService.setServeur('')
      .then(() => {
        this.router.navigate(['/login']).then(() => {
          this.display.display({'code': 'Déconnexion réussi', 'color': 'success'}).then();
        });
      })
  }
}
