import { Acesso } from "./acesso";
import { Sistema } from "./sistema";

export class Processo {
    constructor(){}
    id?: number;
    nome?: string;
    dataProcesso?: Date;
    statusProcesso?: boolean;
    acesso?: Acesso;
    sistema?: Sistema;
  }

