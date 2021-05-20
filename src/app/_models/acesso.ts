import { Sistema } from "./sistema";

export class Acesso {
    constructor(){}
    id?: number;
    hostname?: string;
    ip?: string;
    usuario?: string;
    senha?: string;
    sistema?: Sistema;
  }

