import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgenciaService } from '../../../services/agencia.service';
import { urlServer } from '../../../utilities/common';
import { faEye, faTrash, faCircleArrowUp } from '@fortawesome/free-solid-svg-icons'
import { EncomiendasService } from 'src/app/services/encomiendas.service';
import { EstadoService } from '../../../services/estado.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encomiendas',
  templateUrl: './encomiendas.component.html',
  styleUrls: ['./encomiendas.component.css']
})
export class EncomiendasComponent implements OnInit {
  resultados : boolean = true;
  urlServer = urlServer
  agencias : any = [];
  encomiendas : any = [];
  encom : any = {}; //variable sirve para ver una encomienda en especifico
  estadosEncomiendas: any = [];
  faEye = faEye
  faTrash = faTrash;
  faArrow = faCircleArrowUp;
  load : boolean = false;
  public page: number = 0;

  setIntervalConst:any;

  encomienda = new FormGroup({
    id_agencia: new FormControl ('', [Validators.required]),
    tipo: new FormControl ('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
    activo: new FormControl('', [Validators.required])
  });


  constructor(private agenciaService: AgenciaService, private encomiendaService: EncomiendasService,
              private estadoService: EstadoService, private http: HttpClient , public modal: NgbModal,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.encomienda.get('id_agencia')?.setValue('');
    this.encomienda.get('tipo')?.setValue('');
    this.encomienda.get('estado')?.setValue('');
    this.encomienda.get('activo')?.setValue('1');

    this.agenciaService.obtenerAgencias().subscribe( res=>{
      try {
        this.agencias = res.data;
      } catch (error) {
        console.log(error);
      }
    });

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

  loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  filtrarEncomiendas(){
    this.http.post(this.urlServer + `/encomienda/filtrar`, this.encomienda.value).subscribe( (res: any)=>{
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

  habilitarEncomienda(id: any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/encomienda/habilitar/${id}`,{},header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'La encomienda ha sido habilitada exitosamente',
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
        this.loading();
        this.encomienda.get('activo')?.setValue('1');
        this.filtrarEncomiendas();
      } catch (error) {
        console.log(error);
      }
    });
  }

  inhabilitarEncomienda(id: any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/encomienda/inhabilitar/${id}`, {},header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'La encomienda ha sido inhabilitada exitosamente',
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
        this.loading();
        this.encomienda.get('activo')?.setValue('2');
        this.filtrarEncomiendas();
      } catch (error) {
        console.log(error);
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.setIntervalConst);
  }
}
