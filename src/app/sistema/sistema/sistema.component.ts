import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sistema } from '../../_models/sistema';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { Processo } from 'src/app/_models/processo';
import { Usuario } from 'src/app/_models/usuario';
defineLocale('pt-br', ptBrLocale)

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  styleUrls: ['./sistema.component.css']
})

export class SistemaComponent implements OnInit {
  title = 'SRA-Web';
  currentDataHora: any;
  mostrarProcesso?: number;
  mostrarId? = 0;
  bodyDeletarSistema='';
  modoSalvar = 'post';
  _filtroLista: string;

  sistemasFiltrados?: Sistema[];
  sistemas?: Sistema[];
  sistema?: Sistema;
  processos: Processo[];
  processo: Processo;
  usuarios?: Usuario[];
  _usuario?: Usuario;
  usuario?: FormGroup;

  registerForm?: FormGroup;

  readonly apiURL : string;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private localeService: BsLocaleService,
    ) {
      this.localeService.use('pt-br');
    this.apiURL = 'http://localhost:8081'; //Maquina Ezequiel.
    //this.apiURL = 'http://10.240.3.89:8081'; //Servidor Produção.
  }

  ngOnInit() {
    this.getSistema();
    this.validation();
  }

  get filtroLista(): string{
    return this._filtroLista;
  }

  set filtroLista(value: string){
    this._filtroLista = value;
    this.sistemasFiltrados = this.filtroLista ? this.filtrarsistemas(this.filtroLista) : this.sistemas;
  }

  filtrarsistemas(filtrarPor: string ): Sistema[] | undefined {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.sistemas?.filter(
      sis => sis?.nome?.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  openModal(template: any){
    template.show();
  }

  novoSistema(template: any){
    this.modoSalvar = 'post';
    this.registerForm?.reset();
    this.currentDataHora = new Date();
    this.openModal(template);
    this.getUsuario();
  }

  editarSistema(sistema: Sistema, template: any){
    this.modoSalvar = 'put';
    this.registerForm?.reset();
    this.currentDataHora = new Date();
    this.openModal(template);
    this.sistema = Object.assign({}, sistema);
    this.registerForm?.patchValue(this.sistema);
    this.getUsuario();
  }

  salvarSistema(template: any){
    if(this.modoSalvar == 'post'){
      this.sistema = Object.assign({}, this.registerForm?.value);
      this.sistema!.dataAtualizacao = this.currentDataHora;
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
    else{
      this.sistema = Object.assign({id: this.sistema?.id}, this.registerForm?.value);
      this.http.put(`${ this.apiURL }/sistemas/` + this.sistema?.id ,this.sistema).subscribe(
      () => {
        template.hide();
        this.getSistema();
        this.toastr.success('Atualizado com sucesso!');
      }, error => {
        this.toastr.error(`Erro ao tentar Atualizar: ${error}`);
      }
      );
    }

  }

  alternarProcesso(_sistema: Sistema){
    this.sistema = _sistema;
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

  updateStatusProcesso(_processo: Processo) {
    this.processo = _processo;
    this.processo.statusProcesso = !this.processo.statusProcesso;
    this.processo.dataProcesso = new Date();

    return this.http.put(`${ this.apiURL }/processos/` + this.processo.id, this.processo).
            subscribe(
            resultado => {
              this.toastr.success('Processo alterado com sucesso.');
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

  updateStatusProcessos(_sistema: Sistema){
      this.http.get<Processo[]>(`${this.apiURL}/processos/sistema/${_sistema?.id}`).
      subscribe(response => {
        this.processos = response;
      });
  }

  abrirModalExcluir(sistema: Sistema, template: any) {
    this.openModal(template);
    this.sistema = sistema;
    this.bodyDeletarSistema = `Tem certeza que deseja deletar este Sistema: ${sistema?.nome}`;
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

  getUsuario() {
    this.http.get<Usuario[]>(`${this.apiURL}/usuarios`).
    subscribe(response => {
        this.usuarios = response;
    },
    err => {
        this.toastr.error("Error occured.");
    });
  }

  getSistema() {
    this.http.get<Sistema[]>(`${this.apiURL}/sistemas`).
      subscribe(response => {
        this.sistemas = response;
        this.sistemasFiltrados = this.sistemas;
      },
      err => {
        this.toastr.error("Error occured.");
      });
  }

  getProcessos(sistema: Sistema) {
    this.http.get<Processo[]>(`${this.apiURL}/processos/sistema/${sistema?.id}`).
      subscribe(response => {
        this.processos = response;
      },
      erro => {
      this.toastr.error('Erro ao carregar Tabela!' + erro.error.mensagem);
    });
  }

  updateStatusSistema(_sistema: Sistema) {
    this.sistema = _sistema;
    this.sistema!.statusSistema = !this.sistema?.statusSistema;
    this.sistema.dataAtualizacao = new Date();

    return this.http.put(`${ this.apiURL }/sistemas/` + this.sistema?.id, this.sistema).
            subscribe(
              resultado => {
              this.getSistema();
              this.updateStatusProcessos(_sistema);
              this.toastr.success('Atualizado com sucesso!');
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
      dataAtualizacao: ['', Validators.required],
      usuario: this.fb.group({
        id: [''],
      })
    });
  }
}
