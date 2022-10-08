import {Component, OnInit} from '@angular/core';
import {HttpService} from "../core/http.service";

// import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public serveur: string;
  public newServeur: string;

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
  }

  clickCreer() {
    // lastValueFrom
    this.httpService.isServerExisting(this.newServeur)
  }
}
