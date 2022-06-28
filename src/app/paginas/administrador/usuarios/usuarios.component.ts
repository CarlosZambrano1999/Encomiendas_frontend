import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgenciaService } from '../../../services/agencia.service';
import { EmpleadosService } from '../../../services/empleados.service';
import { faPen, faTrash, faCircleArrowUp, faSearch } from '@fortawesome/free-solid-svg-icons'
import { urlServer } from 'src/app/utilities/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  resultados : boolean = true;
  usuario: any = {}; // hace referencia al usuario logueado;
  agencias : any = [];
  empleados : any = [];
  habilitado : any = {};
  datosEmpleado : any = {};
  cambioAgencia : boolean = false;
  faPen  =  faPen;
  faTrash = faTrash;
  faArrow = faCircleArrowUp;
  faSearch = faSearch;
  urlServer = urlServer;
  public load: boolean = false;
  public page: number = 1;

  resultImg: string = '';
  image : any = [];
  anio1: number = new Date().getFullYear();
  /*Formularios */
  empleado = new FormGroup({
    id_agencia: new FormControl ('', [Validators.required]),
    activos: new FormControl('', [Validators.required]),
    logueados: new FormControl('', [Validators.required])
  });

  editEmpleado = new FormGroup({
    id_usuario: new FormControl ('', [Validators.required]),
    codigo_usuario : new FormControl('', [Validators.required]),
    nombre: new FormControl ('', [Validators.required, Validators.pattern(/^([A-Za-zñáéíóú]+[\s]*)+$/)]),
    correo: new FormControl ('', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]),
    agencia: new FormControl ('', [Validators.required])
  });

  newEmpleado = new FormGroup({
    cod_usuario : new FormControl('', [Validators.required, Validators.maxLength(19), Validators.pattern(/^[a-zA-Z]+$/)]),
    nombre: new FormControl ('', [Validators.required, Validators.pattern(/^([A-Za-zñáéíóú]+[\s]*)+$/)]),
    correo: new FormControl ('', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/) ]),
    agencia: new FormControl ('', [Validators.required])
  });

  codigo = new FormControl('', [Validators.required]);//input para buscar empleado por codigo

  constructor(private agenciaService: AgenciaService, private empleadoService: EmpleadosService,
              private http: HttpClient, public modal: NgbModal, private authService: AuthService,
              private storageService: StorageService
              ) { }

  //Funciones al iniciar el componente
  ngOnInit(): void {
    //obtener las agencias para el filtrado
    this.agenciaService.obtenerAgencias().subscribe( res=>{
      try {
        this.agencias = res.data;
      } catch (error) {
        console.log(error);
      }
    });

    //obtiene todos los empleados
    this.empleadoService.obtenerUsuario().subscribe( res=>{
      try {
        this.usuario = res.data;
      } catch (error) {
        console.log(error);
      }
    });

    this.empleado.get('activos')?.setValue(1);

    this.obtenerEmpleados();

    this.loading();
  }

  //Muestra spinner mientras cargan los datos
  loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  //funcion para obtener los empleados
  obtenerEmpleados(){
    this.empleadoService.obtenerEmpleados().subscribe( res=>{
      try {
        if(res.data.length>0){
          this.empleados = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion para filtrar empleados
  filtrarEmpleados(){
    this.http.post(this.urlServer + `/empleado/filtrar`, this.empleado.value).subscribe( (res:any)=>{
      try {
        if(res.data.length>0){
          this.empleados = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion que muestra el modal para editar un empleado
  editarEmpleado(emp : any, modal : any){
    this.editEmpleado.reset();
    this.datosEmpleado = emp;
    this.editEmpleado.get('id_usuario')?.setValue(emp.id_usuario);
    this.editEmpleado.get('codigo_usuario')?.setValue(emp.codigo_usuario);
    this.editEmpleado.get('nombre')?.setValue(emp.nombre);
    this.editEmpleado.get('correo')?.setValue(emp.correo);
    this.editEmpleado.get('agencia')?.setValue(emp.id_agencia)
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //funcion para guardar los cambios en usuario
  confirmarEdicion(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/empleado/editarEmpleado`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Usuario Editado Correctamente',
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
        this.obtenerEmpleados();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion que muestra modal para agregar un nuevo empleado
  agregarEmpleado(modal : any){
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //funcion para guardar nuevo empleado
  guardarEmpleado(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/empleado/crearEmpleado`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Nuevo usuario creado Correctamente',
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
        this.newEmpleado.reset();
        this.loading();
        this.obtenerEmpleados();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion que muestra modal para habilitar o inhabilitar un usuario
  habEmpleado(emp : any,modal : any){
    this.habilitado=emp;
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //funcion para habilitar o inhabilitar empleado
  habilitarEmpleado(emp : any){
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
            text: 'El usuario ha sido habilitado',
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
        this.filtrarEmpleados();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion para inhabilitar empleado
  inhabilitarEmpleado(emp : any){
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
            text: 'El usuario ha sido inhabilitado',
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
        this.filtrarEmpleados();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion para buscar usuario por codigo
  obtenerPorCodigo(){
    if(this.codigo.value){
      this.empleadoService.obtenerPorCodigo(this.codigo.value).subscribe(res=>{
        try {
          this.empleados=res.data
        } catch (error) {
          console.log(error);
        }
      })
    }else{
      this.obtenerEmpleados();
    }
  }

  //Funcion para comparar los datos del usuario antes y despues de editar
  objCompare(obj1: any, obj2: any){
    if (obj1.nombre === obj2.nombre &&  obj1.correo === obj2.correo && obj1.agencia.toString()===obj2.id_agencia.toString()){
        return true;
    }else{
      return false;
    }
  }

  cargarImagen(event: any){
    this.image= [];
    this.resultImg='';
    let archivo = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivo[0]);
    reader.onloadend = () => {
    console.log('img' ,reader.result);
    this.image.push(reader.result);
    console.log('img2' ,this.image[0]);
    }
  }

  agregarFirma(emp: any){
    if(this.image.length>0){
      this.storageService.subirImagen(emp.nombre, this.image[0]).then( url  =>{
        const employeed={
          id_usuario: emp.id_usuario,
          firma: url
        }
        var header = {
          headers: new HttpHeaders()
            .set('Authorization',  `Bearer ${this.authService.getToken()}`)
        }
        this.http.post(urlServer + `/empleado/agregarFirma`, employeed, header).subscribe( (res:any)=>{
          try {
            if(res.message=='Successfully'){
              Swal.fire({
                icon: 'success',
                title: 'Exitoso',
                text: 'Firma agregada con exito',
                width: 'auto',
                showConfirmButton: false,
                timer: 1500
              });
            this.image= [];
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se ha seleccionado ningun archivo',
                width: 'auto',
                showConfirmButton: true
              });
            }
            this.modal.dismissAll();
            this.filtrarEmpleados();
          } catch (error) {
            console.log(error);
          }
        });
      });
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Aun no se ha cargado ningun archivo',
        width: 'auto',
        showConfirmButton: true
      });
    }
  }

}

