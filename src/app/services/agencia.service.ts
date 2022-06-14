import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlServer } from '../utilities/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AgenciaService {
  urlServer: string = urlServer;
  constructor(private http: HttpClient, private authService:AuthService) { }

  obtenerAgencias():Observable<any>{
    return this.http.get(this.urlServer + '/agencia', {});
  }

  agenciasInhabilitadas():Observable<any>{
    return this.http.get(this.urlServer + '/agencia/inhabilitadas', {});
  }

  obtenerDemasAgencias():Observable<any>{
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    return this.http.get(urlServer + `/agencia/resto`, header);
  }
}
