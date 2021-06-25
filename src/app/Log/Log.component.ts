import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Log } from '../_models/log';
import { Sistema } from '../_models/sistema';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-Log',
  templateUrl: './Log.component.html',
  styleUrls: ['./Log.component.css']
})
export class LogComponent implements OnInit {
  title = 'SRA-Web';

  fileName= 'ExcelSheet.xlsx';

  currentDataHora: any;
  bodyDeletarUsuario='';
  modoSalvar = 'post';
  numberPaginations = 10;
  _filtroLista: string;
  _filtroListaProcesso: string;
  _filtroListaHostname: string;
  _filtroListaTipoLog: string;
  dataInicio: string;
  dataFim : string;

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
    //this.apiURL = 'http://localhost:8081'; //Maquina Ezequiel.
    this.apiURL = 'http://192.168.0.111:8081'; //Servidor Mestre.
    //this.apiURL = 'http://10.240.3.89:8081'; //Servidor Produção.
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

  get filtroListaProcesso(): string{
    return this._filtroListaProcesso;
  }

  set filtroListaProcesso(value: string){
    this._filtroListaProcesso = value;
    this.sistemasFiltrados = this.filtroListaProcesso ? this.filtrarProcesso(this.filtroListaProcesso) : this.logs;
  }

  get filtroListaHostname(): string{
    return this._filtroListaHostname;
  }

  set filtroListaHostname(value: string){
    this._filtroListaHostname = value;
    this.sistemasFiltrados = this.filtroListaHostname ? this.filtrarHostname(this.filtroListaHostname) : this.logs;
  }

  get filtroListaTipoLog(): string{
    return this._filtroListaTipoLog;
  }

  set filtroListaTipoLog(value: string){
    this._filtroListaTipoLog = value;
    this.sistemasFiltrados = this.filtroListaTipoLog ? this.filtrarTipoLog(this.filtroListaTipoLog) : this.logs;
  }

  get filtroListaDataFim(): string{
    return this.dataFim;
  }

  set filtroListaDataFim(value: string){
    this.dataFim = value;
    this.sistemasFiltrados = this.filtroListaDataFim ? this.filtrarDataFim(this.filtroListaDataFim) : this.logs;
  }

  get filtroListaDataInicio(): string{
    return this.dataInicio;
  }

  set filtroListaDataInicio(value: string){
    this.dataInicio = value;
    this.sistemasFiltrados = this.filtroListaDataInicio ? this.filtrarDataInicio(this.filtroListaDataInicio) : this.logs;
  }

  filtrarsistemas(filtrarPor: string ): any | undefined {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.collection.filter(
      sis => sis?.sistema?.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  filtrarProcesso(filtrarPor: string ): any | undefined {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.collection.filter(
      sis => sis?.processo?.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  filtrarHostname(filtrarPor: string ): any | undefined {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.collection.filter(
      sis => sis?.hostname?.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  filtrarTipoLog(filtrarPor: string ): any | undefined {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.collection.filter(
      sis => sis?.tipoLog?.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  filtrarDataInicio(filtrarPor: string): any | undefined {
    return this.collection.filter(
      filtrar => filtrar?.dataRestart.replace(" ","T").substring(0,16) >= filtrarPor &&
                  filtrar?.dataRestart.replace(" ","T").substring(0,16) <= this.dataFim
    );
  }

  filtrarDataFim(filtrarPor: string): any | undefined {
    return this.collection.filter(
      filtrar => filtrar?.dataRestart.replace(" ","T").substring(0,16) >= this.dataInicio &&
                  filtrar?.dataRestart.replace(" ","T").substring(0,16) <= filtrarPor
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

  exportarRelatorio(){
  /* table id is passed over here */
    let element = document.getElementById('exportExcel');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
