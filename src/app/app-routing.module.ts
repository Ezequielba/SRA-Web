import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SobreComponent } from './sobre/sobre/sobre.component';
import { AcessoComponent } from './acesso/acesso/acesso.component';
import { LogComponent } from './Log/Log.component';
import { ProcessoComponent } from './processo/processo/processo.component';
import { SistemaComponent } from './sistema/sistema/sistema.component';
import { UsuarioComponent } from './usuario/usuario/usuario.component';

const routes: Routes = [
{path: 'log', component: LogComponent},
{path: 'sobre', component: SobreComponent},
{path: 'processo', component: ProcessoComponent},
{path: 'acesso', component: AcessoComponent},
{path: 'usuario', component: UsuarioComponent},
{path: 'sistema', component: SistemaComponent},
{path: '', redirectTo: 'sistema', pathMatch: 'full'},
{path: '**', redirectTo: 'sistema', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
