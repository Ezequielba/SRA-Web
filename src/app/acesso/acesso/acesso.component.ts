import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Acesso } from 'src/app/_models/acesso';
import { Sistema } from 'src/app/_models/sistema';
import { Usuario } from 'src/app/_models/usuario';

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css']
})

export class AcessoComponent implements OnInit {

  title = 'SRA-Web';

  currentDataHora: any;

  acessos?: Acesso[];
  acesso?: Acesso;
  sistemas?: Sistema[];
  _sistema?: Sistema;
  usuarios?: Usuario[];
  _usuario?: Usuario;
  sistema?: FormGroup;
  registerForm?: FormGroup;
  bodyDeletarAcesso='';

  modoSalvar = 'post'

  readonly apiURL : string;

  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: ToastrService) {
    this.apiURL = 'http://localhost:8081'; //Maquina Ezequiel.
    //this.apiURL = 'http://10.240.3.89:8081'; //Servidor Produção.
    //this.apiURL = 'http://192.168.0.117:8081'; //Servidor Eliel.
  }

  ngOnInit() {
    this.getAcesso();
    this.validation();
  }

  openModal(template: any){
    template.show();

  }

  novoAcesso(template: any){
    this.modoSalvar = 'post';
    this.registerForm?.reset();
    this.openModal(template);
    this.getSistema();
  }

  salvarAcesso(template: any){
    if(this.modoSalvar == 'post'){
    this.acesso = Object.assign({}, this.registerForm?.value);
    this.http.post(`${ this.apiURL }/acessos/`, this.acesso).
          subscribe(
          resultado => {
            template.hide();
            this.getAcesso();
            this.toastr.success('Acesso adicionado com sucesso');
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
    else{
      this.acesso = Object.assign({id: this.acesso?.id}, this.registerForm?.value);
      this.http.put(`${ this.apiURL }/acessos/` + this.acesso?.id ,this.acesso).subscribe(
      () => {
        template.hide();
        this.getAcesso();
        this.toastr.success('Atualizado com sucesso!');
      }, error => {
        this.toastr.error(`Erro ao tentar Atualizar: ${error}`);
      }
      );
    }
  }

  abrirModalExcluir(acesso: Acesso, template: any) {
    this.openModal(template);
    this.acesso = acesso;
    this.bodyDeletarAcesso = `Tem certeza que deseja excluir o Evento: ${acesso.hostname}`;
  }

  excluirAcesso(template: any) {
    return this.http.delete(`${ this.apiURL }/acessos/` + this.acesso?.id).
            subscribe(
            resultado => {
              template.hide();
              this.getAcesso();
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

  getAcesso() {
    this.http.get<Acesso[]>(`${this.apiURL}/acessos`).
    subscribe(response => {
        this.acessos = response;
    },
    err => {
        this.toastr.error("Error occured.");
    });
  }

  getSistema() {
    this.http.get<Sistema[]>(`${this.apiURL}/sistemas`).
      subscribe(response => {
        this.sistemas = response;
      },
      err => {
        this.toastr.error("Error occured.");
      });
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

  editarAcesso(acesso: Acesso, template: any){
    this.modoSalvar = 'put';
    this.registerForm?.reset();
    this.currentDataHora = new Date();
    this.openModal(template);
    this.acesso = Object.assign({}, acesso);
    this.registerForm?.patchValue(this.acesso);
    this.getSistema();
  }

  validation(){
    this.registerForm = this.fb.group({
      hostname: ['', Validators.required],
      ip: ['', Validators.required],
      usuario: ['', Validators.required],
      senha: ['', Validators.required],
      diretorio: ['', Validators.required],
      stop: ['', Validators.required],
      start: ['', Validators.required],
      sistema: this.fb.group({
        id: [''],
      })
    });
  }
}
