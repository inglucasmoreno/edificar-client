import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment';

import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  public usuarios: Usuario[];
  public total = 0;
  public limit = 10;
  public desde = 0;
  public hasta = 10;
  public filtroActivo = '';
  public filtroDni = '';
  public loading = true;

  // Para reportes
  public totalReporte = 0;
  public usuariosReporte = [];

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.usuariosService.listarUsuarios(this.limit, this.desde, this.filtroActivo, this.filtroDni).subscribe( resp => {
      const { usuarios, total } = resp;
      this.usuarios = usuarios;
      this.total = total;
      this.loading = false;
    }, (({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
    }));
  }

  actualizarEstado(usuario: Usuario): void {
    const { uid, activo } = usuario;
    Swal.fire({
      title: '¿Estas seguro?',
      text: `¿Quieres actualizar el estado de ${usuario.nombre}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;  
        this.usuariosService.actualizarUsuario(uid, {activo: !activo}).subscribe(resp => {
          this.listarUsuarios();
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: `Has actualizado el estado de ${usuario.nombre}`,
            showConfirmButton: false,
            timer: 1000
          });
        }, ({error}) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
        });
      }
    });

  }

  actualizarDesdeHasta(selector): void {

    this.loading = true;

    if (selector === 'siguiente'){ // Incrementar
      if (this.hasta < this.total){
        this.desde += this.limit;
        this.hasta += this.limit;
      }
    }else{                         // Decrementar
      this.desde -= this.limit;
      if (this.desde < 0){
        this.desde = 0;
      }else{
        this.hasta -= this.limit;
      }
    }

    this.listarUsuarios();

  }

  filtrarActivos(activo: any): void{
    this.loading = true;
    this.filtroActivo = activo;
    this.listarUsuarios();
  }

  filtrarDni(dni: string): void{
    this.loading = true;
    this.filtroDni = dni;
    this.listarUsuarios();
  }
}