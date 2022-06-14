import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header-administrador',
  templateUrl: './header-administrador.component.html',
  styleUrls: ['./header-administrador.component.css']
})
export class HeaderAdministradorComponent implements OnInit {

  constructor(private router : Router, public modal: NgbModal,
              private cookieService:CookieService) { }

  ngOnInit(): void {
  }

  //Funcion para abril modal que confirma el cierre de sesion
  cerrarSesion(modal : any){
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //Funcion para salir (borra las cookies, cierra la venta modal y redirige al login)
  salir(){
    this.cookieService.deleteAll();
    this.modal.dismissAll();
    this.router.navigate(['/', 'login']);
  }
}
