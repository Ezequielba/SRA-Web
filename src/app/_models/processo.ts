import { Acesso } from "./acesso";
import { Sistema } from "./sistema";

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
    acesso?: Acesso;
    sistema?: Sistema;
  }

