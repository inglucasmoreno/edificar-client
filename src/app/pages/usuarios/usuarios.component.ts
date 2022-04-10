import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';
import { ReportesService } from '../../services/reportes.service';
import { format } from 'date-fns';

import { saveAs } from 'file-saver-es'; 
import { DataService } from 'src/app/services/data.service';
import { AlertService } from 'src/app/services/alert.service';

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
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'apellido'
  }

  // Para reportes
  public totalReporte = 0;
  public usuariosReporte = [];

  constructor(private usuariosService: UsuariosService,
              private alertService: AlertService,
              private dataService: DataService,
              private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Usuarios';
    this.alertService.loading();
    this.listarUsuarios();
  }

  // Generar reporte de usuarios
  generarReporte(): void {

    this.alertService.question({ msg: 'Está por generar un reporte', buttonText: 'Generar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.reportesService.usuarios(
              this.filtro.activo, 
              this.filtro.parametro,
              this.ordenar.direccion,
              this.ordenar.columna
            ).subscribe(archivoExcel => {
              Swal.close();
              saveAs(archivoExcel,`Usuarios ${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
            },({error})=>{
              Swal.close();
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.msg,
                showCancelButton: false,
                confirmButtonText: 'Entendido'
              });
            }); 
          }
        });  
  }

  // Listar usuarios
  listarUsuarios(): void {
    this.usuariosService.listarUsuarios(
      this.paginacion.limit, 
      this.paginacion.desde, 
      this.filtro.activo, 
      this.filtro.parametro,
      this.ordenar.direccion,
      this.ordenar.columna
      )
    .subscribe( ({ usuarios, total }) => {
      this.alertService.close();
      this.usuarios = usuarios;
      this.total = total;
    }, (({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(usuario: Usuario): void {

    const { uid, activo } = usuario;

    this.alertService.question({ msg: '¿Quiere actualizar el estado?', buttonText: 'Actualizar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.alertService.loading();
            this.usuariosService.actualizarUsuario(uid, {activo: !activo}).subscribe(resp => {
              this.listarUsuarios();
              Swal.fire({
                icon: 'success',
                title: 'Completado',
                text: `Estado actualizado`,
                showConfirmButton: false,
                timer: 1000
              });
            }, ({error}) => {
              this.alertService.errorApi(error.msg);
            });
          }
        });  
  }

  // Funcion de paginación
  actualizarDesdeHasta(selector): void {
    
    this.alertService.loading();

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
  
  // Reiniciar paginacion
  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;
    this.paginacion.limit = 10;
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.alertService.loading();
    this.filtro.activo = activo;
    this.reiniciarPaginacion();
    this.listarUsuarios();
  }

  // Filtrar por Parametro
  filtrarParametro(parametro: string): void{
    this.alertService.loading();
    this.filtro.parametro = parametro;
    this.reiniciarPaginacion();
    this.listarUsuarios();
  }
  
  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarUsuarios();
  }

}