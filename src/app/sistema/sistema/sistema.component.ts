import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Sistema } from '../../_models/sistema';



@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  styleUrls: ['./sistema.component.css']
})


export class SistemaComponent implements OnInit {
  title = 'SRA-Web';
  sistemas?: Sistema[];
  sistema?: Sistema;

  readonly apiURL : string;

  constructor(private http: HttpClient) {
    this.apiURL = 'http://localhost:8080';
  }

  ngOnInit() {
    this.getSistema();
  }

  getSistema() {
    this.http.get<Sistema[]>(`${this.apiURL}/sistemas`).
    subscribe(response => {
        this.sistemas = response;
        console.log(this.sistemas);

    },
    err => {
        console.log("Error occured.");
    });

    console.log (this.sistemas);

  }
  
  updateStatusSistema(_sistema: Sistema) {
    this.sistema = _sistema;
    this.sistema.statusSistema = !this.sistema.statusSistema;
    console.log(this.sistema.statusSistema);
    
    return this.http.put(`${ this.apiURL }/sistemas/` + this.sistema.id, this.sistema).
                  subscribe(
                resultado => {
                  console.log('Status alterado com sucesso.')
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
