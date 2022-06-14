import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgenciaService } from '../../../services/agencia.service';
import { faPen , faTrash, faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
import { EmpleadosService } from '../../../services/empleados.service';
import { AuthService } from '../../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { urlServer, phoneNumber } from '../../../utilities/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agencias',
  templateUrl: './agencias.component.html',
  styleUrls: ['./agencias.component.css']
})
export class AgenciasComponent implements OnInit {
  resultados : boolean = true;
  public load: boolean = false;
  public page: number =1;
  collection: any= [];
  usuario : any = {};
  habilitado : any = {};
  agencias : any = [];
  comparar: any = {};
  urlServer = urlServer;
  faPen  =  faPen;
  faTrash = faTrash;
  faArrow = faCircleArrowUp
  activos = new FormControl('', [Validators.required]);

  /*Formularios*/
  newAgencia = new FormGroup({
    nombre : new FormControl('', [Validators.required, Validators.pattern(/^([A-Z,]+[\s]*)+$/)]),
    siglas : new FormControl('', [Validators.required,Validators.pattern('[A-Z]+'), Validators.maxLength(4)]),
    telefono : new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'),Validators.maxLength(10)]),
    direccion : new FormControl('', [Validators.required])
  })

  editAgencia = new FormGroup({
    id_agencia : new FormControl('', [Validators.required]),
    nombre : new FormControl('', [Validators.required, Validators.pattern(/^([A-Z,]+[\s]*)+$/)]),
    siglas : new FormControl('', [Validators.required, Validators.pattern('[A-Z]+'), Validators.maxLength(4)]),
    telefono : new FormControl('', [Validators.required,Validators.pattern('[- +()0-9]+'), Validators.maxLength(10)]),
    direccion : new FormControl('', [Validators.required])
  })

  constructor(private agenciaService: AgenciaService, private empleadoService : EmpleadosService,
              private authService : AuthService, public modal: NgbModal, private http: HttpClient) { }

  ngOnInit(): void {
    this.activos.setValue('1');

    this.empleadoService.obtenerUsuario().subscribe( res=>{
      try {
        this.usuario = res.data;
      } catch (error) {
        console.log(error);
      }
    });

    this.obtenerAgencias();
    this.loading();
  }

  //Funcion para mostrar spinner mientras cargan datos
  loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  //Funcion para obtener las agencias
  obtenerAgencias(){
    this.agenciaService.obtenerAgencias().subscribe( res=>{
      try {
        if(res.data.length>0){
          this.agencias = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion para filtrar las agencias segun su estado
  estadoAgencia(){
    if(this.activos.value==1){
      this.agenciaService.obtenerAgencias().subscribe( res=>{
        try {
          if(res.data.length>0){
            this.agencias = res.data;
            this.resultados = true;
          }else{
            this.resultados = false;
          }
        } catch (error) {
          console.log(error);
        }
      });
    }else if(this.activos.value==2){
      this.agenciaService.agenciasInhabilitadas().subscribe( res=>{
        try {
          console.log('agencia', res.data);
          if(res.data.length>0){
            this.agencias = res.data;
            this.resultados = true;
          }else{
            this.resultados = false;
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  }

  //funcion que muestra modal para agregar una agencia
  agregarAgencia(modal : any){
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //funcion para guardar una nueva agencia
  guardarAgencia(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/agencia/crearAgencia`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Nuevo Agencia creada Correctamente',
            width: 'auto',
            showConfirmButton: false,
            timer: 2000
          });
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
        this.modal.dismissAll();
        this.newAgencia.reset();
        this.loading();
        this.obtenerAgencias();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion que muestra modal para editar agencia
  editarAgencia(agen : any, modal : any){
    this.editAgencia.reset();
    this.comparar = agen;
    this.editAgencia.get('id_agencia')?.setValue(agen.id_agencia);
    this.editAgencia.get('nombre')?.setValue(agen.nombre);
    this.editAgencia.get('siglas')?.setValue(agen.siglas);
    this.editAgencia.get('telefono')?.setValue(agen.telefono);
    this.editAgencia.get('direccion')?.setValue(agen.direccion);
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //funcion para guardar los cambios en una agencia
  confirmarEdicion(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/agencia/editarAgencia`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Agencia Editado Correctamente',
            width: 'auto',
            showConfirmButton: false,
            timer: 2000
          });
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
        this.modal.dismissAll();
        this.loading();
        this.estadoAgencia();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion que muestra modal para poder habilitar o inhabilitar agencia
  habAgencia(emp : any,modal : any){
    this.habilitado=emp;
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //Funcion para habilitar agencia
  habilitarAgencia(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/agencia/habilitarAgencia`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'La agencia ha sido habilitada',
            width: 'auto',
            showConfirmButton: false,
            timer: 1500
          });
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
        this.modal.dismissAll();
        this.loading();
        this.activos.setValue('1');
        this.estadoAgencia();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion para inhabilitar agencia
  inhabilitarAgencia(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/agencia/inhabilitarAgencia`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'La agencia ha sido inhabilitada',
            width: 'auto',
            showConfirmButton: false,
            timer: 1500
          });
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
        this.modal.dismissAll();
        this.loading();
        this.activos.setValue('2');
        this.estadoAgencia();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion para comparar los datos de la agencia antes y despues de editar
  objCompare(obj1: any, obj2: any){
    if (JSON.stringify(obj1) === JSON.stringify(obj2)){
        return true;
    };
    return false;
  }
}
