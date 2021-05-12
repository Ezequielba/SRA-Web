import { HttpClient } from '@angular/common/http';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Acesso } from 'src/app/_models/acesso';
import { Processo } from 'src/app/_models/processo';
import { Sistema } from 'src/app/_models/sistema';
import { Usuario } from 'src/app/_models/usuario';

@Component({
  selector: 'app-processo',
  templateUrl: './processo.component.html',
  styleUrls: ['./processo.component.css']
})
export class ProcessoComponent implements OnInit {

  title = 'SRA-Web';
  processos?: Processo[];
  processo?: Processo;
  acessos?: Acesso[];
  _acesso?: Acesso;
  acesso?: FormGroup;
  sistemas?: Sistema[];
  _sistema?: Sistema;
  usuarios?: Usuario[];
  _usuario?: Usuario;
  sistema?: FormGroup;
  registerForm?: FormGroup;
  bodyDeletarProcesso='';
  currentDataHora: any;

  modoSalvar = 'post'

  readonly apiURL : string;

  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: ToastrService) {
    this.apiURL = 'http://localhost:8081'; //Maquina Ezequiel.
    //this.apiURL = 'http://10.240.3.89:8081'; //Servidor Produção.
    //this.apiURL = 'http://192.168.0.117:8081'; //Servidor Eliel.
  }

  ngOnInit() {
    this.getProcesso();
    this.validation();
  }

   openModal(template: any){
    template.show();
  }

  novoProcesso(template: any){
    this.modoSalvar = 'post';
    this.registerForm?.reset();
    this.openModal(template);
    this.currentDataHora = new Date();
    this.getAcesso();
    this.getSistema();
  }

  salvarProcesso(template: any){
    if(this.modoSalvar == 'post'){
    this.processo = Object.assign({}, this.registerForm?.value);
    this.processo!.dataProcesso = this.currentDataHora;
    this.http.post(`${ this.apiURL }/processos/`, this.processo).
          subscribe(
          resultado => {
            template.hide();
            this.getProcesso();
            this.toastr.success('Processo adicionado com sucesso');
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
      this.processo = Object.assign({id: this.processo?.id}, this.registerForm?.value);
      this.http.put(`${ this.apiURL }/processos/` + this.processo?.id ,this.processo).subscribe(
      () => {
        template.hide();
        this.getProcesso();
        this.toastr.success('Atualizado com sucesso!');
      }, error => {
        this.toastr.error(`Erro ao tentar Atualizar: ${error}`);
      }
      );
    }
  }

  editarProcesso(processo: Processo, template: any){
    this.modoSalvar = 'put';
    this.registerForm?.reset();
    this.currentDataHora = new Date();
    this.openModal(template);
    this.processo = Object.assign({}, processo);
    this.registerForm?.patchValue(this.processo);
    this.getAcesso();
    this.getSistema();
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

  getProcesso() {
    this.http.get<Processo[]>(`${this.apiURL}/processos`).
      subscribe(response => {
        this.processos = response;
    },
    err => {
      this.toastr.error("Error occured.");
    });
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

  updateStatusProcesso(_processo: Processo) {
    this.processo = _processo;
    this.processo.statusProcesso = !this.processo.statusProcesso;
    this.processo.dataProcesso = new Date();

    return this.http.put(`${ this.apiURL }/processos/` + this.processo.id, this.processo).
            subscribe(
            resultado => {
              this.toastr.success('Processo alterado com sucesso.')
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

  abrirModalExcluir(processo: Processo, template: any) {
    this.openModal(template);
    this.processo = processo;
    this.bodyDeletarProcesso = `Tem certeza que deseja excluir o Evento: ${processo.nome}`;
  }

  excluirProcesso(template: any) {
    return this.http.delete(`${ this.apiURL }/processos/` + this.processo?.id).
            subscribe(
            resultado => {
              template.hide();
              this.getProcesso();
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

  validation(){
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      dataProcesso: ['', Validators.required],
      acesso: this.fb.group({
        id: [''],
      }),
      sistema: this.fb.group({
        id: [''],
      })
    });
  }
}
