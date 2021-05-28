import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Log } from '../_models/log';

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

  getLog(){
    this.http.get<any>(`${this.apiURL}/log`).
      subscribe(response => {
        this.collection = response;
      },
      err => {
        this.toastr.error("Error occured.");
      });
  }
  getLogs(){
    this.http.get<Log[]>(`${this.apiURL}/log`).
      subscribe(response => {
        this.logs = response;
      },
      err => {
        this.toastr.error("Error occured.");
      });
  }
}
