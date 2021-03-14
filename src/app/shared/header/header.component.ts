import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  // Dropdown
  public showUsuarios = false;
  public showProductos = false;

  public showMenu = true;
  public openAdmin = true;
  public usuarioLogin;

  constructor( private authService: AuthService ) { }

  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario;
  }



  logout(): void{
    this.authService.logout();
  }

  toggleMenu(): void{
    this.showMenu ? this.showMenu = false : this.showMenu = true;
  }

}