import { Usuario } from "./usuario";

export class Sistema {
    constructor(){}
    id?: number;
    nome?: string;
    statusSistema?: boolean;
    dataAtualizacao?: Date;
    usuario?: Usuario;
  }
