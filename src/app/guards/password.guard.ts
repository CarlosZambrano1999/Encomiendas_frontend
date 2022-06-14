import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router) { }

  //Guard para controlar que solo los usuarios que solicitaron el reset de password puedan acceder
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.cookieService.get('change')) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
  }

}
