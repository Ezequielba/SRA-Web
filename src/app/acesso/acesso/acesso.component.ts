import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Acesso } from 'src/app/_models/acesso';
import { Usuario } from 'src/app/_models/Usuario';

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
    this.apiURL = 'http://localhost:8080';
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
