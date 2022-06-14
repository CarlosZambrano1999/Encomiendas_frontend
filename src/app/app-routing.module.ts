import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { UsuariosComponent } from './paginas/administrador/usuarios/usuarios.component';
import { AdministradoresComponent } from './paginas/administrador/administradores/administradores.component';
import { AgenciasComponent } from './paginas/administrador/agencias/agencias.component';
import { EncomiendasComponent } from './paginas/administrador/encomiendas/encomiendas.component';
import { EnviarComponent } from './paginas/usuario/enviar/enviar.component';
import { EnviadosComponent } from './paginas/usuario/enviados/enviados.component';
import { RecibidosComponent } from './paginas/usuario/recibidos/recibidos.component';
import { AuthGuard } from './guards/auth.guard';
import { SessionGuard } from './guards/session.guard';
import { AdminGuard } from './guards/admin.guard';
import { UsersGuard } from './guards/users.guard';
import { PasswordComponent } from './paginas/password/password.component';
import { PasswordGuard } from './guards/password.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate:[SessionGuard], data:{title:'Encomiendas Login'}},
  {path: 'singUp', component: RegistroComponent, canActivate:[SessionGuard] , data:{title:'Encomiendas Registro'}},
  {path: 'change', component: PasswordComponent, canActivate:[PasswordGuard], data:{title:'Encomiendas Cambio Contraseña'} },
  {path: 'users', component: UsuariosComponent, canActivate:[AuthGuard, AdminGuard], data:{title:'Encomiendas Usuarios'}},
  {path: 'administrators', component: AdministradoresComponent, canActivate:[AuthGuard, AdminGuard], data:{title:'Encomiendas Administradores'}},
  {path: 'agencies', component: AgenciasComponent, canActivate:[AuthGuard, AdminGuard], data:{title:'Encomiendas Agencias'}},
  {path: 'parcels', component: EncomiendasComponent, canActivate:[AuthGuard, AdminGuard] , data:{title:'Encomiendas'}},
  {path: 'send', component: EnviarComponent, canActivate:[AuthGuard, UsersGuard], data:{title:'Enviar PILARH-Encomiendas'}},
  {path: 'sent', component: EnviadosComponent, canActivate:[AuthGuard, UsersGuard], data:{title:'Enviados PILARH-Encomiendas'}},
  {path: 'received', component: RecibidosComponent, canActivate:[AuthGuard, UsersGuard], data:{title:'Recibidos PILARH-Encomiendas'}},
  {path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
