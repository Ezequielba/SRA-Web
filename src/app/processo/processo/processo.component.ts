import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Processo } from 'src/app/_models/processo';

@Component({
  selector: 'app-processo',
  templateUrl: './processo.component.html',
  styleUrls: ['./processo.component.css']
})
export class ProcessoComponent implements OnInit {

  title = 'SRA-Web';
  processos?: Processo[];
  processo?: Processo;

  readonly apiURL : string;

  constructor(private http: HttpClient) {
    this.apiURL = 'http://localhost:8080'; //Maquina Ezequiel.
    //this.apiURL = 'http://10.240.3.89:8090'; //Servidor Produção.
  }

  ngOnInit() {
    this.getProcesso();
  }

  getProcesso() {
    this.http.get<Processo[]>(`${this.apiURL}/processos`).
    subscribe(response => {
        this.processos = response;
        console.log(this.processos);

    },
    err => {
        console.log("Error occured.");
    });

    console.log (this.processos);

  }

  updateStatusProcesso(_processo: Processo) {
    this.processo = _processo;
    this.processo.statusProcesso = !this.processo.statusProcesso;
    console.log(this.processo.statusProcesso, this.processo);
    
    return this.http.put(`${ this.apiURL }/processos/` + this.processo.id, this.processo).
                  subscribe(
                resultado => {
                  console.log('Processo alterado com sucesso.')
                  console.log(this.http.put)
                },
                erro => {
                  switch(erro.status) {
                    case 400:
                      console.log(erro.error.mensagem);
                      break;
                    case 404:
                      console.log('Erro para alterar.');
                      break;
                  }
                }
              );
  }

}
