import { Component, Inject, OnInit } from '@angular/core';
import { EmpleadosService } from '../../../services/empleados.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AgenciaService } from '../../../services/agencia.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { urlServer } from '../../../utilities/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { DatePipe, DOCUMENT } from '@angular/common';



@Component({
  selector: 'app-enviar',
  templateUrl: './enviar.component.html',
  styleUrls: ['./enviar.component.css']
})
export class EnviarComponent implements OnInit {

  usuario: any = {}; // hace referencia al usuario logueado;
  agencias: any = [];
  load: boolean = false;
  urlServer= urlServer;
  agencia_receptora : any = {};

  /* Variables para fecha */

  fecha = new Date();
  fechaAct: any = '';
  fechaMin: any = '';
  fechaMax: any = '';

  /*Formulario Crear Encomienda*/
  encomienda : FormGroup = this.formBuilder.group({
    empresa: new FormControl('',[Validators.required]),
    chofer: new FormControl(),
    telefono_chofer: new FormControl(),
    descr_trans: new FormControl(),
    descripcion: new FormControl('',[Validators.required]),
    fecha_envio: new FormControl('',[Validators.required]),
    hora_envio: new FormControl('',[Validators.required]),
    fecha_llegada: new FormControl('',[Validators.required]),
    hora_llegada: new FormControl('',[Validators.required]),
    agencia_receptora: new FormControl('', [Validators.required])
  })

  constructor(private empleadoService:EmpleadosService, private agenciaService: AgenciaService,
              private route:Router, private http: HttpClient, private atp: AmazingTimePickerService,
              public modal : NgbModal, private authService:AuthService, private formBuilder: FormBuilder,
              public datepipe: DatePipe) { }

  //Funciones de inicio
  ngOnInit(): void {
    //Obtiene al usuario logueado
    this.empleadoService.obtenerUsuario().subscribe( res=>{
      try {
        this.usuario = res.data;
      } catch (error) {
        console.log(error);
      }
    });

    //Obtiene todas las agencias excepto la agencia que pertence el usuario logueado
    this.agenciaService.obtenerDemasAgencias().subscribe( res=>{
      try {
        this.agencias = res.data;
      } catch (error) {
        console.log(error);
      }
    });

    //Convierte las fechas
    this.fechaAct = this.datepipe.transform(this.fecha, 'yyyy-MM-dd');
    this.fechaMin = this.datepipe.transform((this.fecha.setDate(this.fecha.getDate()-2)), 'yyyy-MM-dd');
    this.fechaMax = this.datepipe.transform((this.fecha.setDate(this.fecha.getDate()+5)), 'yyyy-MM-dd');

    //Carga Spinner de inicio
    this.loading();
  }

  //Muestra Spinner al Cargar datos
  loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  //muestra el reloj para agregar hora de salida y de llegada de una encomienda
  open(){
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time=>{
      console.log(time);
    });
  }

  //Funcion que carga modal para enviar un paquete
  enviar(modal:any){
    this.agencia_receptora=this.agencias.find((e: { id_agencia: number; }) => e.id_agencia === parseInt(this.encomienda.get('agencia_receptora')?.value,10));
    this.encomienda.get('fecha_envio')?.setValue(this.datepipe.transform(this.encomienda.get('fecha_envio')?.value, 'dd/MM/yyyy'))
    this.encomienda.get('fecha_llegada')?.setValue(this.datepipe.transform(this.encomienda.get('fecha_llegada')?.value, 'dd/MM/yyyy'))
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //Funcion que confirma y agrega la nueva modal
  confirmar(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/encomienda`, this.encomienda.value, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'La encomienda se realizo exitosamente',
            width: 'auto',
            showConfirmButton: false,
            timer: 2000
          });
          this.modal.dismissAll();
          this.route.navigate(['/', 'sent']);
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
    });
  }

}
