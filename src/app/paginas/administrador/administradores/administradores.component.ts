import { Component, OnInit } from '@angular/core';
import { AdministradorService } from '../../../services/administrador.service';
import { faPen, faTrash, faArrowCircleUp, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { urlServer } from '../../../utilities/common';
import { EmpleadosService } from '../../../services/empleados.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})

export class AdministradoresComponent implements OnInit {
  resultados : boolean = true;
  public load: boolean = false;
  public page: number = 1;
  usuario: any = {}; // hace referencia al usuario logueado;
  datosAdmin : any = {};
  administradores : any = [];
  habilitado: any = {};
  urlServer = urlServer;
  faPen  =  faPen;
  faTrash = faTrash;
  faArrow = faArrowCircleUp;
  faSearch = faSearch;

  /*formularios*/
  codigo = new FormControl('',[Validators.required]);//input para buscar empleado por codigo

  administrador = new FormGroup({
    activo: new FormControl('', [Validators.required]),
  });

  newAdministrador = new FormGroup({
    cod_usuario : new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/), Validators.maxLength(19)]),
    nombre: new FormControl ('', [Validators.required, Validators.pattern(/^([A-Za-zñáéíóú]+[\s]*)+$/)]),
    correo: new FormControl ('', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)])
  });

  editAdministrador = new FormGroup({
    id_usuario: new FormControl ('', [Validators.required]),
    cod_usuario : new FormControl('', [Validators.required]),
    nombre: new FormControl ('', [Validators.required, Validators.pattern(/^([A-Za-zñáéíóú]+[\s]*)+$/)]),
    correo: new FormControl ('', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)])
  });

  constructor(private administradorService:AdministradorService, private http: HttpClient,
              private empleadoService: EmpleadosService, public modal: NgbModal,
              private authService: AuthService ) { }

  //Funciones de arranque
  ngOnInit(): void {
    this.administrador.get('activo')?.setValue(1);
    this.obtenerUsuario();

    this.obtenerAdministradores();
    this.loading();
  }

  //funcion que muestra spinner al cargar datos
  loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  //Funcion para obtener los administradores
  obtenerAdministradores(){
    this.administradorService.obtenerAdministradores().subscribe( res=>{
      try {
        if(res.message="Successfully"){
          this.administradores = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion para obtener al usuario logueado
  obtenerUsuario(){
    this.empleadoService.obtenerUsuario().subscribe( res=>{
      try {
        this.usuario = res.data;
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion para filtrar administradores por si es activo o inactivo
  filtrarAdministradores(){
    this.http.post(this.urlServer + `/administrador/filtrar`, this.administrador.value).subscribe( (res:any)=>{
      try {
        if(res.data.length>0){
          this.administradores = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion que llama al modal para agregar administrador
  agregarAdministrador(modal : any){
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }
  //Funcion que guarda el nuevo administrador que se agrega desde el modal
  guardarAdmin(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/administrador/crearAdministrador`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Nuevo administrador creado correctamente',
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
        this.newAdministrador.reset();
        this.loading();
        this.obtenerUsuario();
        this.obtenerAdministradores();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion que llama al modal para editar usuario (Carga los datos anteriores)
  editarAdministrador(admin : any , modal : any){
    this.editAdministrador.reset();
    this.datosAdmin = admin;
    this.editAdministrador.get('id_usuario')?.setValue(admin.id_usuario);
    this.editAdministrador.get('cod_usuario')?.setValue(admin.codigo_usuario);
    this.editAdministrador.get('nombre')?.setValue(admin.nombre);
    this.editAdministrador.get('correo')?.setValue(admin.correo);
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //Funcion para guardar los cambios al editar adminnistrador
  confirmarEdicion(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/administrador/editarAdministrador`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Administrador Editado Correctamente',
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
        this.obtenerAdministradores();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion que muestra modal para habilitar administrador
  habAdmin(emp : any,modal : any){
    this.habilitado=emp;
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //funcion que confirma la habilitacion del administrador
  habilitarAdministrador(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/usuario/habilitar`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'El administrador ha sido habilitado',
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
        this.obtenerAdministradores();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion que confirma la inhabilitacion del administrador
  inhabilitarAdministrador(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/usuario/inhabilitar`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'El Administrador ha sido inhabilitado',
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
        this.obtenerAdministradores();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion para buscar administradores por su codigo de usuario
  obtenerPorCodigo(){
    if(this.codigo.value){
      this.administradorService.obtenerPorCodigo(this.codigo.value).subscribe(res=>{
        try {
          this.administradores=res.data;
        } catch (error) {
          console.log(error);
        }
      })
    }else{
      this.obtenerAdministradores();
    }
  }

  //Funcion para comparar los datos del administrador antes y despues de editar
  objCompare(obj1: any, obj2: any){
    if (obj1.id_usuario === obj2.id_usuario && obj1.cod_usuario === obj2.codigo_usuario && obj1.nombre === obj2.nombre &&  obj1.correo === obj2.correo){
        return true;
    };
    return false;
  }
}
