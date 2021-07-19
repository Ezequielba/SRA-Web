import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/authServices/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isExpired = false;

  model: any = {};
  constructor(private authService: AuthService,
              public router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    if(localStorage.getItem('token') !== null){
      if(!this.authService.loggedIn()){
        this.router.navigate(['/sistema']);
        this.isExpired = false;
      }
      else{
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.toastr.show('Acesso Expirado!');
        this.router.navigate(['/user/login']);
        this.isExpired = true;
      }
    }
  }

  login(){
    this.authService.login(this.model)
    .subscribe(
      () => {
        this.router.navigate(['/sistema']);
      },error =>{
        if(!this.isExpired){
          this.toastr.error('Falha ao tentar Logar');
        }
      }
    );
  }
}
