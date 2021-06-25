import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CommonModule } from '@angular/common/';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SistemaComponent } from './sistema/sistema/sistema.component';
import { ProcessoComponent } from './processo/processo/processo.component';
import { AcessoComponent } from './acesso/acesso/acesso.component';
import { UsuarioComponent } from './usuario/usuario/usuario.component';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { NavComponent } from './menu/nav/nav.component';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatePipe } from "@angular/common";
import { LogComponent } from './Log/Log.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';

import { AuthInterceptor } from './auth/auth.interceptor';
import { ConsolidadoComponent } from './consolidado/consolidado.component';

@NgModule({
  declarations: [
      AppComponent,
      SistemaComponent,
      ProcessoComponent,
      AcessoComponent,
      UsuarioComponent,
      NavComponent,
      LogComponent,
      UserComponent,
      LoginComponent,
      ConsolidadoComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
     DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
