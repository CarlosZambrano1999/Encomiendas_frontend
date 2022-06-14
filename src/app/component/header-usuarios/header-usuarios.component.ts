import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header-usuarios',
  templateUrl: './header-usuarios.component.html',
  styleUrls: ['./header-usuarios.component.css']
})
export class HeaderUsuariosComponent implements OnInit {

  constructor(private router:Router, private cookieService: CookieService,
    public modal: NgbModal, @Inject(DOCUMENT) private document: any) { }

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
