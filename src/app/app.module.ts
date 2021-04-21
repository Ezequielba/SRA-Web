import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CommonModule } from '@angular/common/';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SistemaComponent } from './sistema/sistema/sistema.component';
import { ProcessoComponent } from './processo/processo/processo.component';
import { AcessoComponent } from './acesso/acesso/acesso.component';
import { UsuarioComponent } from './usuario/usuario/usuario.component';
import { SobreComponent } from './sobre/sobre/sobre.component';
import { NavComponent } from './menu/nav/nav.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [	
    AppComponent,
    SistemaComponent,
    ProcessoComponent,
    AcessoComponent,
    UsuarioComponent,
    NavComponent,
      SobreComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
