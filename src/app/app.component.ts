import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sistema } from './_models/sistema';
import { Sobre } from '../app/sobre/sobre/sobre';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(){}

  ngOnInit() {
  }
  
}
