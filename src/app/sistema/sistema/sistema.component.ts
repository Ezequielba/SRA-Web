import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sistema } from '../../_models/sistema';
import { ToastrService } from 'ngx-toastr';
import { Processo } from 'src/app/_models/processo';

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  styleUrls: ['./sistema.component.css']
})

export class SistemaComponent implements OnInit {
  title = 'SRA-Web';
  sistemas?: Sistema[];
  sistema?: Sistema;
  processos: Processo[];
  processo: Processo;
  mostrarProcesso?: number;
  mostrarId?: number;
  registerForm?: FormGroup;
  bodyDeletarSistema='';

  readonly apiURL : string;

  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: ToastrService) {
    //this.apiURL = 'http://localhost:8080'; //Maquina Ezequiel.
    //this.apiURL = 'http://10.240.3.89:8081'; //Servidor Produção.
    this.apiURL = 'http://192.168.0.117:8081'; //Servidor Eliel.
  }

  ngOnInit() {
    //this.getSistema();
    this.getProcessos();
    this.validation();
  }

  openModal(template: any){
    template.show();
  }

  novoSistema(template: any){
    this.registerForm?.reset();
    this.openModal(template);
  }

  salvarSistema(template: any){
    this.sistema = Object.assign({}, this.registerForm?.value);
    this.http.post(`${ this.apiURL }/sistemas/`, this.sistema).
      subscribe(
        resultado => {
        template.hide();
          this.getSistema();
          this.toastr.success('Sistema adicionado com sucesso');
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

  alternarProcesso(_processo: Processo){
    this.sistema = _processo.sistema;
    if(this.mostrarId == undefined){
      this.mostrarProcesso = this.sistema?.id;
      this.mostrarId = this.sistema?.id;
    }else if(this.mostrarId == this.sistema?.id){
      this.mostrarProcesso = undefined;
      this.mostrarId = undefined;
    }else{
      this.mostrarProcesso = this.sistema?.id;
      this.mostrarId = this.sistema?.id;
    }
  }

  abrirModalExcluir(processo: Processo, template: any) {
    this.openModal(template);
    this.sistema = processo.sistema;
    this.bodyDeletarSistema = `Tem certeza que deseja excluir o Evento: ${processo?.sistema?.nome}`;
  }

  excluirSistema(template: any) {
    return this.http.delete(`${ this.apiURL }/sistemas/` + this.sistema?.id).
      subscribe(
      resultado => {
        template.hide();
        this.getSistema();
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

  getSistema() {
    this.http.get<Sistema[]>(`${this.apiURL}/sistemas`).
      subscribe(response => {
        this.sistemas = response;
      },
      err => {
        this.toastr.success("Error occured.");
      });
  }

  getProcessos() {
    this.http.get<Processo[]>(`${this.apiURL}/processos`).
      subscribe(response => {
        this.processos = response;
      },
      erro => {
      this.toastr.error('Erro ao carregar Tabela!' + erro.error.mensagem);
    });
  }

  updateStatusSistema(_processo: Processo) {
    this.sistema = _processo.sistema;
    this.sistema!.statusSistema = !this.sistema?.statusSistema;

    return this.http.put(`${ this.apiURL }/sistemas/` + this.sistema?.id, this.sistema).
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
      statusSistema: ['', Validators.required],
      dataAtualizacao: ['', Validators.required]
    });
  }
}
