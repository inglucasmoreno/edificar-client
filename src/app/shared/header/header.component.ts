import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  // Dropdown
  public showProductos = false;
  public showIngresoEgreso = false;

  public usuarioLogin;

  constructor( public authService: AuthService,
               public dataService: DataService ) { }

  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario;
  }

  logout(): void{
    this.authService.logout();
  }

}