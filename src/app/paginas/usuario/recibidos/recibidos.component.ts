import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgenciaService } from 'src/app/services/agencia.service';
import { AuthService } from 'src/app/services/auth.service';
import { EncomiendasService } from 'src/app/services/encomiendas.service';
import { EstadoService } from 'src/app/services/estado.service';
import Swal from 'sweetalert2';
import { urlServer } from '../../../utilities/common';

@Component({
  selector: 'app-recibidos',
  templateUrl: './recibidos.component.html',
  styleUrls: ['./recibidos.component.css']
})
export class RecibidosComponent implements OnInit {
  resultados : boolean = true;
  urlServer = urlServer;
  encomiendas : any = [];
  encom : any = {}; //variable sirve para ver una encomienda en especifico
  estadosEncomiendas: any = [];
  faEye = faEye
  load : boolean = false;
  public page: number = 0;
  setIntervalConst:any;

  estado= new FormControl('', [Validators.required]); //filtrar por estado


  constructor(private agenciaService: AgenciaService, private encomiendaService: EncomiendasService,
              private estadoService: EstadoService, private http: HttpClient , public modal: NgbModal,
              private authService: AuthService) { }

  //Funciones iniciales
  ngOnInit(): void {
    //Obtiene los estados de las encomiendas para poder filtra
    this.estadoService.obtenerEstados().subscribe( res => {
      try {
        this.estadosEncomiendas = res.data;
      } catch (error) {
        console.log(error);
      }
    })

    this.loading();

    this.filtrarEncomiendas();

    this.setIntervalConst = setInterval(() => {
      this.filtrarEncomiendas();
    }, 60000);
  }

  //Funcion que carga spinner para mostrar datos
  loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  //Funcion que carga spinner mas lento
  loading2(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 2000);
  }

  //funcion para filtar encomiendas segun el estado
  filtrarEncomiendas(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    let state = {
      id_estado: this.estado.value
    }
    this.http.post(this.urlServer + `/encomienda/recibidos`, state, header).subscribe( (res: any)=>{
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

  //funcion para ver los detalles de una encomienda
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

  //funcion para validar una encomienda
  validarEncomienda(id: String){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(this.urlServer + `/encomienda/validar/${id}`, {}, header).subscribe( (res: any)=>{
      try {
        if(res.message=="Successfully"){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Ya estas al pendiente de esta encomienda, confirma su recibo posteriormente',
            width: 'auto',
            showConfirmButton: false,
            timer: 1500
          });
          this.estado.setValue(2);
          this.loading2();
          this.filtrarEncomiendas();
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

  //Función para confirmar una encomienda
  confirmarEncomienda(id: String){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(this.urlServer + `/encomienda/confirmar/${id}`, {}, header).subscribe( (res: any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Encomienda confirmada exitosamente',
            width: 'auto',
            showConfirmButton: false,
            timer: 1500
          });
          this.estado.setValue(3);
          this.loading2();
          this.filtrarEncomiendas();
        }else{
          const mensaje = res.messagge;
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

  ngOnDestroy(): void {
    clearInterval(this.setIntervalConst);
  }
}

