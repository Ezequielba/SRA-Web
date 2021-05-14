import { Sistema } from "./sistema";

export class Acesso {
    constructor(){}
    id?: number;
    hostname?: string;
    ip?: string;
    usuario?: string;
    senha?: string;
    diretorio?: string;
    stop?: string;
    start?: string;
    sistema?: Sistema;
  }

