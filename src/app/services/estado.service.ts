import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlServer } from '../utilities/common';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  urlServer: string = urlServer;
  constructor(private http: HttpClient) { }

  obtenerEstados():Observable<any>{
    return this.http.get(this.urlServer + '/estado', {});
  }
}
