import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ServeurModel} from '../shared/models/serveur.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseLink = environment.base + 'citations/';

  constructor(private readonly http: HttpClient) {
  }

  getServeur(id): Observable<ServeurModel> {
    const url = this.baseLink + 'getServeur/' + id;
    return this.http.get<ServeurModel>(url);
  }

  initServeur(id): Observable<any> {
    const url = this.baseLink + 'initServeur/' + id;
    return this.http.get<any>(url);
  }

  suppServeur(id): Observable<any> {
    const url = this.baseLink + 'suppServeur/' + id;
    return this.http.get<any>(url);
  }

  addMessage(id, data): Observable<any> {
    const url = this.baseLink + 'addMessage/' + id;
    return this.http.post<any>(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  removeMessage(id, date): Observable<any> {
    const url = this.baseLink + 'removeMessage/' + id + '/' + date;
    return this.http.get<any>(url);
  }

  isServeurExisting(id): Observable<any> {
    const url = this.baseLink + 'isServeur/' + id;
    return this.http.get<any>(url);
  }

  renameServeur(oldName, newName): Observable<any> {
    const url = this.baseLink + 'renameServeur/' + oldName + '/' + newName;
    return this.http.get<any>(url);
  }
}
