import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsolidadoComponent } from './consolidado/consolidado.component';
import { AcessoComponent } from './acesso/acesso/acesso.component';
import { LogComponent } from './Log/Log.component';
import { ProcessoComponent } from './processo/processo/processo.component';
import { SistemaComponent } from './sistema/sistema/sistema.component';
import { UsuarioComponent } from './usuario/usuario/usuario.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: 'user', component: UserComponent,
  children:
  [
    {path: 'login', component: LoginComponent}
  ]
 },
{path: 'log', component: LogComponent, canActivate: [AuthGuard]},
{path: 'consolidado', component: ConsolidadoComponent, canActivate: [AuthGuard]},
{path: 'processo', component: ProcessoComponent, canActivate: [AuthGuard]},
{path: 'acesso', component: AcessoComponent, canActivate: [AuthGuard]},
{path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard]},
{path: 'sistema', component: SistemaComponent, canActivate: [AuthGuard]},
{path: '', redirectTo: 'sistema', pathMatch: 'full'},
{path: '**', redirectTo: 'sistema', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
