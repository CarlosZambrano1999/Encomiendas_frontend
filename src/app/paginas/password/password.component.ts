import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { urlServer } from 'src/app/utilities/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  load: boolean = false;
  fieldTextType: boolean =  false;
  fieldTextType2: boolean =  false;
  faEye= faEye;
  faEyeSlash = faEyeSlash;
  urlServer=urlServer;
  /*formulario*/
  sesion = new FormGroup({
    cod_usuario : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required]),
    confirmPassword : new FormControl('', [Validators.required])
  })
  constructor(private router:Router, private cookieService: CookieService,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.loading();
  }

  loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
    this.fieldTextType2 = !this.fieldTextType2;
  }

  resetPassword(){
    if(this.sesion.get('password')?.value!=this.sesion.get('confirmPassword')?.value){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Contraseña y verificar contraseña no coinciden',
        width: 'auto',
        showConfirmButton: true
      });
    }else{
      this.http.post( this.urlServer + `/usuario/resetPassword`, this.sesion.value).subscribe((res:any)=>{
        try {
          if(res.message=='succesfully'){
              Swal.fire({
                icon: 'success',
                title: 'Contraseña cambiada',
                text: 'La contraseña se cambió exitosamente',
                width: 'auto',
                showConfirmButton: false,
                timer: 2000
              });
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
              this.cookieService.delete('change');
            this.sesion.reset();
          }else if(res.message!='succesfully'){
            const mensaje =res.message;
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
}
