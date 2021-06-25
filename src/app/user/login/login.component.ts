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

  model: any = {};
  constructor(private authService: AuthService,
              public router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    if(localStorage.getItem('token') !== null){
      this.router.navigate(['/sistema']);
    }
  }

  login(){
    this.authService.login(this.model)
    .subscribe(
      () => {
        this.router.navigate(['/sistema']);
      },error =>{
          this.toastr.error('Falha ao tentar Logar');
      }
    );
  }
}
