import { forwardRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderAdministradorComponent } from './component/header-administrador/header-administrador.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { UsuariosComponent } from './paginas/administrador/usuarios/usuarios.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import  {  FontAwesomeModule  }  from  '@fortawesome/angular-fontawesome';
import { AdministradoresComponent } from './paginas/administrador/administradores/administradores.component';
import { AgenciasComponent } from './paginas/administrador/agencias/agencias.component';
import { EncomiendasComponent } from './paginas/administrador/encomiendas/encomiendas.component';
import { LoadingComponent } from './component/loading/loading.component';
import { HeaderUsuariosComponent } from './component/header-usuarios/header-usuarios.component';
import { EnviarComponent } from './paginas/usuario/enviar/enviar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { EnviadosComponent } from './paginas/usuario/enviados/enviados.component';
import { RecibidosComponent } from './paginas/usuario/recibidos/recibidos.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PasswordComponent } from './paginas/password/password.component';
import { NgxPrintModule } from 'ngx-print';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    HeaderAdministradorComponent,
    UsuariosComponent,
    AdministradoresComponent,
    AgenciasComponent,
    EncomiendasComponent,
    LoadingComponent,
    HeaderUsuariosComponent,
    EnviarComponent,
    EnviadosComponent,
    RecibidosComponent,
    PasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    CommonModule,
    AmazingTimePickerModule,
    NgxPaginationModule,
    NgxPrintModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
