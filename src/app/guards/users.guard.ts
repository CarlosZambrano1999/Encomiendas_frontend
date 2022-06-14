import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { EmpleadosService } from '../services/empleados.service';

@Injectable({
  providedIn: 'root'
})
export class UsersGuard implements CanActivate {
  constructor(private router: Router, private empleadoService: EmpleadosService,
    private cookieService:CookieService) {
  }

  //Guard para controlar que solo los empleados puedan acceder
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const rol = this.cookieService.get('rol');
    if(rol=="1" || rol=="2"){
      this.router.navigate(['/','users']);
      return false;
    }else{
      return true;
    }
  }
}
