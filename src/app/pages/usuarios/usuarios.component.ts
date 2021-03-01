import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  // Usuarios Listados
  public usuarios: Usuario[];
  public total = 0;

  // Paginacion
  public paginacion = {
    limit: 10,
    desde: 0,
    hasta: 10
  };

  // Filtrado
  public filtro = {
    activo: true,
    dni: '',
  }
  public loading = true;

  // Para reportes
  public totalReporte = 0;
  public usuariosReporte = [];

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  // Listar usuarios
  listarUsuarios(): void {
    this.usuariosService.listarUsuarios(
      this.paginacion.limit, 
      this.paginacion.desde, 
      this.filtro.activo, 
      this.filtro.dni)
    .subscribe( resp => {
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

  // Actualizar estado
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

  // Funcion de paginación
  actualizarDesdeHasta(selector): void {

    this.loading = true;

    if (selector === 'siguiente'){ // Incrementar
      if (this.paginacion.hasta < this.total){
        this.paginacion.desde += this.paginacion.limit;
        this.paginacion.hasta += this.paginacion.limit;
      }
    }else{                         // Decrementar
      this.paginacion.desde -= this.paginacion.limit;
      if (this.paginacion.desde < 0){
        this.paginacion.desde = 0;
      }else{
        this.paginacion.hasta -= this.paginacion.limit;
      }
    }

    this.listarUsuarios();

  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.loading = true;
    this.filtro.activo = activo;
    this.listarUsuarios();
  }

  // Filtrar por DNI
  filtrarDni(dni: string): void{
    this.loading = true;
    this.filtro.dni = dni;
    this.listarUsuarios();
  }
}