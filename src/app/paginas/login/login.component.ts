import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { urlServer } from '../../utilities/common';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { DOCUMENT } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  urlServer=urlServer;
  fieldTextType: boolean =  false;
  load: boolean = false;
  faEye= faEye;
  faEyeSlash = faEyeSlash;
  sesion = new FormGroup({
    cod_usuario: new FormControl ('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  codigo = new FormControl('', [Validators.required]);

  constructor(private http: HttpClient, private cookieService: CookieService,
              private router: Router, @Inject(DOCUMENT) private document: any,
              public modal: NgbModal) { }

  ngOnInit(): void {
    this.loading();
  }

  loading(){
    this.load = false;
    this.document.body.classList.add('bg1');
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  login(){
    this.http.post( this.urlServer + `/usuario/login`, this.sesion.value).subscribe((res:any)=>{
      try {
        if(res.message=='succesfully'){
            if(res.rol=='1' || res.rol=='2' ){
              const dateNow = new Date();
              dateNow.setHours(dateNow.getHours() + 10);
              this.cookieService.set('token', res.token, dateNow);
              this.cookieService.set('rol', res.rol, dateNow);
              this.router.navigate(['/', 'users']);
            }else if(res.rol=='3'){
              const dateNow = new Date();
              dateNow.setHours(dateNow.getHours() + 10);
              this.cookieService.set('token', res.token, dateNow);
              this.cookieService.set('rol', res.rol, dateNow);
              this.router.navigate(['/', 'send']);
            }
          this.sesion.reset();
        }else{
          const mensaje = res.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            width: 'auto',
            showConfirmButton: true
          });
        }
      } catch (error) {
          console.log(error);
      }
    })
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  resetear(modal: any){
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  reset(){
    this.http.post(urlServer + `/usuario/reset/${this.codigo.value}`, {}).subscribe((res:any) =>{
      try {
        if(res.message=='succesfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Por favor revise su correo electrónico',
            width: 'auto',
            showConfirmButton: true
          });
          const dateNow = new Date();
          dateNow.setHours(dateNow.getHours() + 10);
          this.cookieService.set('change', this.codigo.value, dateNow);
          this.codigo.reset();
          this.modal.dismissAll();
        }else{
          const mensaje = res.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            width: 'auto',
            showConfirmButton: true
          });
        }
      } catch (error) {
        console.log(error);
      }
    })
  }
}
