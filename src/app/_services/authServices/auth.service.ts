import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //baseURL = 'http://localhost:8081/';
  baseURL = 'http://192.168.0.111:8081/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

constructor(private http: HttpClient) { }

  login(model: any){
    return this.http
      .post(this.baseURL +"authenticate", model).pipe(
        map((Response: any) => {
          const user = Response;
          if(user){
            localStorage.setItem('token', user.token);
            this.decodedToken = jwt_decode(user.token);
            sessionStorage.setItem('username', this.decodedToken.sub);
          }
        })
    );
  }

  loggedIn(){
    const token = localStorage.getItem('token')?.toString();
    return !this.jwtHelper.isTokenExpired(token);
  }
}
