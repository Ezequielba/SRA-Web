import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/_models/usuario';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  title = 'SRA-Web';
  usuarios?: Usuario[];
  usuario?: Usuario;
  registerForm?: FormGroup;
  bodyDeletarUsuario='';

  readonly apiURL : string;

  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: ToastrService) {
    //this.apiURL = 'http://localhost:8081'; //Maquina Ezequiel.
    //this.apiURL = 'http://10.240.3.89:8081'; //Servidor Produção.
    this.apiURL = 'http://192.168.0.117:8081'; //Servidor Eliel.
  }

  ngOnInit() {
    this.getUsuario();
    this.validation();
  }

  openModal(template: any){
    template.show();
  }

  novoUsuario(template: any){
    this.registerForm?.reset();
    this.openModal(template);
  }

  salvarUsuario(template: any){
    this.usuario = Object.assign({}, this.registerForm?.value);
    this.http.post(`${ this.apiURL }/usuarios/`, this.usuario).
    subscribe(
      resultado => {
        template.hide();
        this.getUsuario();
        this.toastr.success('Usuario adicionado com sucesso');
        console.log(this.http.post);
      },
      erro => {
        switch(erro.status) {
          case 400:
          this.toastr.error(erro.error.mensagem);
          break;
          case 404:
          this.toastr.error('Erro para salvar.');
          break;
        }
      }
    );
  }

  getUsuario() {
    this.http.get<Usuario[]>(`${this.apiURL}/usuarios`).
      subscribe(response => {
        this.usuarios = response;
      },
      err => {
        this.toastr.error("Error occured.");
      });
  }

  abrirModalExcluir(usuario: Usuario, template: any) {
    this.openModal(template);
    this.usuario = usuario;
    this.bodyDeletarUsuario = `Tem certeza que deseja excluir o Evento: ${usuario.nome}`;
  }

  excluirUsuario(template: any) {
    return this.http.delete(`${ this.apiURL }/usuarios/` + this.usuario?.id).
      subscribe(
        resultado => {
          template.hide();
          this.getUsuario();
          this.toastr.success('Excluído com sucesso!');
        },
        erro => {
          switch(erro.status) {
            case 400:
            this.toastr.error(erro.error.mensagem);
            break;
            case 404:
            this.toastr.error('Erro para Excluir!' + erro.error.mensagem);
            break;
          }
        }
      );
  }

  updateStatusUsuario(_usuario: Usuario) {
    this.usuario = _usuario;
    this.usuario.ativo = !this.usuario.ativo;

    return this.http.put(`${ this.apiURL }/usuarios/` + this.usuario.id, this.usuario).
      subscribe(
        resultado => {
          console.log(this.http.put)
        },
        erro => {
          switch(erro.status) {
            case 400:
              this.toastr.error(erro.error.mensagem);
            break;
            case 404:
              this.toastr.error('Erro para alterar.');
            break;
          }
        }
      );
  }

  validation(){
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }
}
