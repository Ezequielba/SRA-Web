import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/authServices/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  nomeUsuario: any;

  constructor(public authService: AuthService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.nomeUsuario = localStorage.getItem('username');
    //this.userName();
  }

  userName(){
    return localStorage.getItem('username');
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.toastr.show('Log Out');
    this.router.navigate(['/user/login']);
  }

  loggedIn(){
    if(this.authService.loggedIn()){
      localStorage.removeItem('token');
      this.toastr.show('Acesso Expirado!');
      this.router.navigate(['/user/login']);
    }
  }

  showMenu(){
    return this.router.url !== '/user/login';
  }

}
