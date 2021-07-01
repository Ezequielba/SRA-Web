import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Acesso } from 'src/app/_models/acesso';
import { Processo } from 'src/app/_models/processo';
import { Sistema } from 'src/app/_models/sistema';
import { TipoProcesso } from 'src/app/_models/tipoProcesso';

@Component({
  selector: 'app-processo',
  templateUrl: './processo.component.html',
  styleUrls: ['./processo.component.css']
})
export class ProcessoComponent implements OnInit {
  title = 'SRA-Web';
  bodyDeletarProcesso='';
  currentDataHora: any;
  modoSalvar = 'post';

  processos?: Processo[];
  processo?: Processo;
  acessos?: Acesso[];
  _acesso?: Acesso;
  acesso?: FormGroup;
  sistemas?: Sistema[];
  _sistema?: Sistema;
  tipoProcessos?: TipoProcesso[];
  _tipoProcesso?: TipoProcesso;
  tipoProcesso?: FormGroup;
  sistema?: FormGroup;

  registerForm?: FormGroup;

  readonly apiURL : string;

  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: ToastrService) {
    this.apiURL = 'http://localhost:8081'; //Maquina Ezequiel.
    //this.apiURL = 'http://192.168.0.111:8081'; //Servidor Mestre.
    //this.apiURL = 'http://10.240.3.89:8081'; //Servidor Produção.
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
    this.getTipoProcesso();
  }

  salvarProcesso(template: any){
    if(this.modoSalvar == 'post'){
    this.processo = Object.assign({}, this.registerForm?.value);
    this.processo!.dataProcesso = this.currentDataHora;
    this.processo!.statusMonitoracao = true;
    this.processo!.statusProcesso = false;
    this.http.post(`${ this.apiURL }/processos/`, this.processo).
          subscribe(
          resultado => {
            template.hide();
            this.getProcesso();
            this.toastr.success('Processo adicionado com sucesso');
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
      console.log(this.processo);
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
    this.getTipoProcesso();
  }

  getTipoProcesso() {
    this.http.get<TipoProcesso[]>(`${this.apiURL}/tipoprocessos`).
      subscribe(response => {
        this.tipoProcessos = response;
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
    this.bodyDeletarProcesso = `Tem certeza que deseja deletar este Processo: ${processo.nome}`;
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

  validaModoSalvar(valor1: any | undefined, valor2: any | undefined){
    var resultado = this.modoSalvar == "post" ? valor1 : valor2;
    return resultado;
  }


  copyMessage(_processo: Processo){
    const selBox = document.createElement('textarea');
    selBox.value = `UPDATE Processo SET statusMonitoracao = FALSE WHERE nome = '${_processo?.nome}' AND sistema_id = ${_processo?.sistema?.id};`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.success("Copiado com Sucesso!");
  }

  validation(){
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      dataProcesso: ['', Validators.required],
      statusMonitoracao:[''],
      statusProcesso: [''],
      diretorio: ['', Validators.required],
      stop: ['', Validators.required],
      start: ['', Validators.required],
      dataAgendamento: ['', Validators.required],
      tipoProcesso: this.fb.group({
        id: [''],
      }),
      acesso: this.fb.group({
        id: [''],
      }),
      sistema: this.fb.group({
        id: [''],
      })
    });
  }
}

