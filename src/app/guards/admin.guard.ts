import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EmpleadosService } from '../services/empleados.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private empleadoService: EmpleadosService,
              private cookieService:CookieService) {
    }
  //Guard para controlar que solo los administradores puedan acceder
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const rol = this.cookieService.get('rol');
      if(rol=="3"){
        this.router.navigate(['/','send']);
        return false;
      }else{
        return true;
      }
    }
  }
