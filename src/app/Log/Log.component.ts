import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Log } from '../_models/log';
import { Sistema } from '../_models/sistema';

@Component({
  selector: 'app-Log',
  templateUrl: './Log.component.html',
  styleUrls: ['./Log.component.css']
})
export class LogComponent implements OnInit {
  title = 'SRA-Web';

  currentDataHora: any;
  bodyDeletarUsuario='';
  modoSalvar = 'post';
  _filtroLista: string;

  sistemasFiltrados?: any;
  sistemas?: Sistema[];
  sistema?: Sistema;
  logs?: Log[];
  log?: Log;
  p: number = 1;
  collection: Array<any>;

  readonly apiURL : string;

  constructor(private http: HttpClient, private toastr: ToastrService)
  {
    this.apiURL = 'http://localhost:8081'; //Maquina Ezequiel.
    //this.apiURL = 'http://10.240.3.89:8081'; //Servidor Produção.
    //this.apiURL = 'http://192.168.0.117:8081'; //Servidor Eliel.
  }

  ngOnInit() {
    this.getLogs();
    this.getLog();
  }

  get filtroLista(): string{
    return this._filtroLista;
  }

  set filtroLista(value: string){
    this._filtroLista = value;
    this.sistemasFiltrados = this.filtroLista ? this.filtrarsistemas(this.filtroLista) : this.logs;
  }

  filtrarsistemas(filtrarPor: string ): any | undefined {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.collection.filter(
      sis => sis?.sistema?.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  getLog(){
    this.http.get<any>(`${this.apiURL}/log`).
      subscribe(response => {
        this.collection = response;
        this.sistemasFiltrados = this.collection;
      },
      err => {
        this.toastr.error("Error occured.");
      });
  }
  

  getLogs(){
    this.http.get<Log[]>(`${this.apiURL}/log`).
      subscribe(response => {
        this.logs = response;
        this.sistemasFiltrados = this.logs;
      },
      err => {
        this.toastr.error("Error occured.");
      });
  }
}
