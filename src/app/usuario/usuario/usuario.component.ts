import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/_models/usuario';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  title = 'SRA-Web';
  usuarios?: Usuario[];
  usuario?: Usuario;

  readonly apiURL : string;

  constructor(private http: HttpClient) {
    //this.apiURL = 'http://localhost:8080'; //Maquina Ezequiel.
    this.apiURL = 'http://10.240.3.89:8081'; //Servidor Produção.
  }

  ngOnInit() {
    this.getUsuario();
  }

  getUsuario() {
    this.http.get<Usuario[]>(`${this.apiURL}/usuarios`).
    subscribe(response => {
        this.usuarios = response;
        console.log(this.usuarios);

    },
    err => {
        console.log("Error occured.");
    });

    console.log (this.usuarios);

  }

  updateStatusUsuario(_usuario: Usuario) {
    this.usuario = _usuario;
    this.usuario.ativo = !this.usuario.ativo;
    console.log(this.usuario.ativo, this.usuario);
    
    return this.http.put(`${ this.apiURL }/usuarios/` + this.usuario.id, this.usuario).
                  subscribe(
                resultado => {
                  console.log('Usuario alterado com sucesso.')
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
