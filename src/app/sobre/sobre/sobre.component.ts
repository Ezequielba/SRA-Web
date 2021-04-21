import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css']
})
export class SobreComponent implements OnInit {

  readonly apiURL : string;

  constructor(private http: HttpClient) {
    this.apiURL = 'http://localhost:8080';
  }

  ngOnInit() {
  }

}
