import { Acesso } from "./acesso";
import { Sistema } from "./sistema";
import { TipoProcesso } from "./tipoProcesso";

export class Processo {
    constructor(){}
    id?: number;
    nome?: string;
    dataProcesso?: Date;
    statusMonitoracao?: boolean;
    statusProcesso?: boolean;
    diretorio?: string;
    stop?: string;
    start?: string;
    tipoProcesso?: TipoProcesso;
    dataAgendamento?: string;
    acesso?: Acesso;
    sistema?: Sistema;
  }

