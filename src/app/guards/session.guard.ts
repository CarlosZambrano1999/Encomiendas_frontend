import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { EmpleadosService } from '../services/empleados.service';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {
  usuario : any = {};

  constructor(
    private cookieService: CookieService,
    private router: Router, private empleadoService: EmpleadosService) { }

  //Guard para controlar que si el usuario esta logueado no lo redigira al login
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.cookieService.get('token')) {
      this.empleadoService.obtenerUsuario().subscribe( res=>{
        try {
          this.usuario = res.data;
          if(this.usuario.id_rol ==1 || this.usuario.id_rol==2 ){
            this.router.navigate(['/', 'users']);
          }else if(this.usuario.id_rol==3){
            this.router.navigate(['/', 'send']);
          }
        } catch (error) {
          console.log(error);
        }
      });
      return false;
    }else {
      return true;
    }
  }
}
