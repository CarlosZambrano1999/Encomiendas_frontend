import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlServer } from '../utilities/common';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  urlServer: string = urlServer;
  constructor(private http: HttpClient, private authService: AuthService ) { }

  obtenerEmpleados():Observable<any>{
    return this.http.get(this.urlServer + '/empleado', {});
  }

  //Obtener empleado por codigo
  obtenerPorCodigo( codigo : any):Observable<any>{
    return this.http.get(this.urlServer + `/empleado/obtener/${codigo}` , {});
  }

  obtenerUsuario():Observable<any>{
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    return this.http.get(urlServer + `/usuario`, header);
  }
}
