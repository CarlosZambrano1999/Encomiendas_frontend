import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlServer } from '../utilities/common';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  urlServer: string = urlServer;
  constructor(private http: HttpClient) { }

  obtenerAdministradores():Observable<any>{
    return this.http.get(this.urlServer + '/administrador', {});
  }

  //Obtener Administrador por codigo
  obtenerPorCodigo( codigo : any):Observable<any>{
    return this.http.get(this.urlServer + `/administrador/obtener/${codigo}` , {});
  }
}
