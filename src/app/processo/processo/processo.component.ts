import { HttpClient } from '@angular/common/http';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Processo } from 'src/app/_models/processo';

@Component({
  selector: 'app-processo',
  templateUrl: './processo.component.html',
  styleUrls: ['./processo.component.css']
})
export class ProcessoComponent implements OnInit {

  title = 'SRA-Web';
  processos?: Processo[];
  processo?: Processo;
  registerForm?: FormGroup;
  bodyDeletarProcesso='';


  readonly apiURL : string;

  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: ToastrService) {
    //this.apiURL = 'http://localhost:8080'; //Maquina Ezequiel.
    //this.apiURL = 'http://10.240.3.89:8081'; //Servidor Produção.
    this.apiURL = 'http://192.168.0.117:8081'; //Servidor Eliel.
  }

  ngOnInit() {
    this.getProcesso();
    this.validation();
  }

   openModal(template: any){
    template.show();
  }

  novoProcesso(template: any){
    this.registerForm?.reset();
    this.openModal(template);
  }

  salvarProcesso(template: any){
    this.processo = Object.assign({}, this.registerForm?.value);
    this.http.post(`${ this.apiURL }/processos/`, this.processo).
                  subscribe(
                resultado => {
                  template.hide();
                  this.getProcesso();
                  console.log('Processo adicionado com sucesso');
                  console.log(this.http.post);
                },
                erro => {
                  switch(erro.status) {
                    case 400:
                      console.log(erro.error.mensagem);
                      break;
                    case 404:
                      console.log('Erro para salvar.');
                      break;
                  }
                }
              );

  }

  getProcesso() {
    this.http.get<Processo[]>(`${this.apiURL}/processos`).
    subscribe(response => {
        this.processos = response;
        console.log(this.processos);

    },
    err => {
        console.log("Error occured.");
    });

    console.log (this.processos);

  }

  updateStatusProcesso(_processo: Processo) {
    this.processo = _processo;
    this.processo.statusProcesso = !this.processo.statusProcesso;
    console.log(this.processo.statusProcesso, this.processo);

    return this.http.put(`${ this.apiURL }/processos/` + this.processo.id, this.processo).
                  subscribe(
                resultado => {
                  console.log('Processo alterado com sucesso.')
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
                      console.log(erro.error.mensagem);
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
      dataProcesso: ['', Validators.required]
    });
  }

}
