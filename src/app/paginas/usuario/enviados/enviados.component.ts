import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPen, faEye } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { EncomiendasService } from 'src/app/services/encomiendas.service';
import { EstadoService } from 'src/app/services/estado.service';
import Swal from 'sweetalert2';
import { urlServer } from '../../../utilities/common';
import { AgenciaService } from '../../../services/agencia.service';
import { DatePipe, DOCUMENT } from '@angular/common';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
  selector: 'app-enviados',
  templateUrl: './enviados.component.html',
  styleUrls: ['./enviados.component.css']
})
export class EnviadosComponent implements OnInit {

  resultados : boolean = true;
  urlServer = urlServer;
  encomiendas : any = [];
  usuario: any = {};
  encom : any = {}; //variable sirve para ver una encomienda en especifico
  datosEncomienda: any = {};
  estadosEncomiendas: any = [];
  agencias : any = [];
  faEye = faEye
  faPen = faPen;
  load : boolean = false;
  public page: number = 0;
  estado= new FormControl('', [Validators.required]);

  setIntervalConst: any;

  /* Variables para fecha */

  fecha = new Date();
  fechaAct: any = '';
  fechaMin: any = '';
  fechaMax: any = '';

  //Formulario para editar encomienda
  editEncomienda = new  FormGroup({
    id_encomienda: new FormControl('', [Validators.required]),
    codigo_encomienda: new FormControl('', [Validators.required]),
    empresa: new FormControl('', [Validators.required]),
    chofer: new FormControl(),
    telefono_chofer: new FormControl(),
    descr_trans: new FormControl(),
    descripcion: new FormControl('',[Validators.required]),
    fecha_llegada: new FormControl('',[Validators.required]),
    hora_llegada: new FormControl('',[Validators.required]),
    agencia_receptora: new FormControl('', [Validators.required])
  })

  constructor(private empleadoService:EmpleadosService, private encomiendaService: EncomiendasService,
              private estadoService: EstadoService, private http: HttpClient , public modal: NgbModal,
              private authService: AuthService, private agenciaService: AgenciaService,
              public datepipe: DatePipe, private atp: AmazingTimePickerService,
              @Inject(DOCUMENT) private document: any) { }

  //Funciones iniciales
  ngOnInit(): void {

    //obtener las agencias
    this.agenciaService.obtenerDemasAgencias().subscribe( res=>{
      try {
        this.agencias = res.data;
      } catch (error) {
        console.log(error);
      }
    });

    //obtiene los datos del usuario logueado
    this.empleadoService.obtenerUsuario().subscribe( res=>{
      try {
        this.usuario = res.data;
      } catch (error) {
        console.log(error);
      }
    });

    //Obtiene los estados de una encomienda para poder filtrarse
    this.estadoService.obtenerEstados().subscribe( res => {
      try {
        this.estadosEncomiendas = res.data;
      } catch (error) {
        console.log(error);
      }
    })

    this.fechaAct = this.datepipe.transform(this.fecha, 'yyyy-MM-dd');
    this.fechaMax = this.datepipe.transform((this.fecha.setDate(this.fecha.getDate()+5)), 'yyyy-MM-dd');
    this.loading();
    this.filtrarEncomiendas();

    //actualiza la pagina
    this.setIntervalConst = setInterval(() => {
      this.filtrarEncomiendas();
    }, 60000);
  }

  //funcion para mostrar spinner mientras cargan los datos
  loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  open(){
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time=>{
      console.log(time);
    });
  }

  //funcion para filtrar las encomiendas segun el estado de la misma
  filtrarEncomiendas(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    let state = {
      id_estado: this.estado.value
    }
    this.http.post(this.urlServer + `/encomienda/enviados`, state, header).subscribe( (res: any)=>{
      try {
        if(res.data.length>0){
          this.encomiendas = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    })
  }

  //funcion para ver mas detalles sobre una encomienda
  verEncomienda(id : any, modal : any){
    this.encomiendaService.verEncomienda(id).subscribe( res => {
      try {
        this.encom = res.data[0];
        this.modal.open(modal);
      } catch (error) {
        console.log(error);
      }
    })
  }

  //funcion que muestra el modal para editar una Encomienda
  editarEncomienda(emp : any, modal : any){
    this.editEncomienda.reset();
    this.datosEncomienda = emp;
    this.fechaMin = emp.fecha_envio.split("/").reverse().join("-")
    this.editEncomienda.get('id_encomienda')?.setValue(emp.id_encomienda);
    this.editEncomienda.get('codigo_encomienda')?.setValue(emp.codigo_encomienda);
    this.editEncomienda.get('empresa')?.setValue(emp.empresa);
    this.editEncomienda.get('chofer')?.setValue(emp.chofer);
    this.editEncomienda.get('descr_trans')?.setValue(emp.descripcion_transporte)
    this.editEncomienda.get('telefono_chofer')?.setValue(emp.telefono_chofer);
    this.editEncomienda.get('descripcion')?.setValue(emp.descripcion);
    this.editEncomienda.get('fecha_llegada')?.setValue(emp.fecha_llegada.split("/").reverse().join("-"));
    this.editEncomienda.get('hora_llegada')?.setValue(emp.hora_llegada.slice(0,-3));
    this.editEncomienda.get('agencia_receptora')?.setValue(emp.agencia_receptora);
    this.modal.open(modal, {backdropClass: 'my-custom-class'});
  }

  //funcion para guardar los cambios en una encomienda
  confirmarEdicion(enc : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    enc['fecha_llegada']= this.datepipe.transform(this.editEncomienda.get('fecha_llegada')?.value, 'dd/MM/yyyy')
    this.http.post(urlServer + `/encomienda/editar`, enc, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Encomienda Editada Correctamente',
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
        this.filtrarEncomiendas();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion para comparar los datos de la encomienda antes y despues de editar
  objCompare(){
    let datos = this.datosEncomienda;
    if (this.editEncomienda.get('agencia_receptora')?.value.toString()===datos.agencia_receptora.toString() && this.editEncomienda.get('empresa')?.value===datos.empresa && this.editEncomienda.get('chofer')?.value===datos.chofer && this.editEncomienda.get('telefono_chofer')?.value===datos.telefono_chofer && this.editEncomienda.get('fecha_llegada')?.value===datos.fecha_llegada.split("/").reverse().join("-") && this.editEncomienda.get('hora_llegada')?.value===datos.hora_llegada.slice(0,-3) && this.editEncomienda.get('descripcion')?.value===datos.descripcion && this.editEncomienda.get('descr_trans')?.value===datos.descripcion_transporte ){
        return true;
    }else{
      return false;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.setIntervalConst);
  }
}
