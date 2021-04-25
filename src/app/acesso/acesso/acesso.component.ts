import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Acesso } from 'src/app/_models/acesso';

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css']
})
export class AcessoComponent implements OnInit {


  title = 'SRA-Web';
  acessos?: Acesso[];
  acesso?: Acesso;

  readonly apiURL : string;

  constructor(private http: HttpClient) {
    this.apiURL = 'http://localhost:8080'; //Maquina Ezequiel.
    //this.apiURL = 'http://10.240.3.89:8090'; //Servidor Produção.
  }

  ngOnInit() {
    this.getAcesso();
  }

  getAcesso() {
    this.http.get<Acesso[]>(`${this.apiURL}/acessos`).
    subscribe(response => {
        this.acessos = response;
        console.log(this.acessos);

    },
    err => {
        console.log("Error occured.");
    });

    console.log (this.acessos);

  }

}
