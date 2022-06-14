import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlServer } from '../utilities/common';

@Injectable({
  providedIn: 'root'
})
export class EncomiendasService {

  urlServer: string = urlServer;
  constructor(private http: HttpClient) { }

  verEncomienda(id_encomienda: any):Observable<any>{
    return this.http.get(this.urlServer + `/encomienda/ver/${id_encomienda}`, {});
  }
}
