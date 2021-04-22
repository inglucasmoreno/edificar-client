import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UnidadMedidaService } from '../../../services/unidad-medida.service';
import  { UnidadMedida } from '../../../models/unidad-medida.model';
import { ReportesService } from '../../../services/reportes.service';
import { format } from 'date-fns';

import { saveAs } from 'file-saver-es'; 

@Component({
  selector: 'app-unidad-medida',
  templateUrl: './unidad-medida.component.html',
  styles: [
  ]
})
export class UnidadMedidaComponent implements OnInit {

  public total = 0;
  public unidades: UnidadMedida[] = [];
  public loadingNuevaUnidad = false;
  public loadingTabla = true;

  public loading = true;

  // Paginación
  public paginacion = {
    limit: 10,
    desde: 0,
    hasta: 10
  };

  // Filtrado
  public filtro = {
    descripcion: '',
    activo: true
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'descripcion'
  }

  constructor(private unidadMedidaService: UnidadMedidaService,
              private reportesService: ReportesService) { }

  ngOnInit(): void {
     this.listarUnidades(); 
  }

  // Generar reporte de usuarios
  generarReporte(): void {

    Swal.fire({
      title: "¿Está seguro?",
      text: "Está por generar un reporte",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Generar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: 'Generando',
          html: 'Creando reporte',
          timerProgressBar: true,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        });

        this.reportesService.unidades(
          this.filtro.activo,
          this.filtro.descripcion,
          this.ordenar.direccion,
          this.ordenar.columna
        ).subscribe(archivoExcel => {
          Swal.close();
          saveAs(archivoExcel,`Unidades ${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
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
    })

  }

  // Nueva unidad
  nuevaUnidad(descripcionCtrl: any): void {
    const descripcion = descripcionCtrl.value;
    if(descripcion.trim() === ''){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Formulario inválido',
        confirmButtonText: 'Entendido'  
      });
      return;
    }
    this.loadingNuevaUnidad = true;
    descripcionCtrl.value = '';
    this.unidadMedidaService.nuevaUnidad({ descripcion }).subscribe( resp => {
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'Unidad creada correctamente',
        timer: 1000,
        showConfirmButton: false
      })
      this.loadingNuevaUnidad = false;
      this.listarUnidades();
    },(({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingNuevaUnidad = false;
    }));
  }

  // Listar unidades
  listarUnidades(): void {
    this.loadingTabla = true;
    this.unidadMedidaService.listarUnidades(
      this.paginacion.limit,
      this.paginacion.desde,
      this.filtro.activo,
      this.filtro.descripcion,
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe( ({ total, unidades }) => {
      this.total = total;
      this.unidades = unidades; 
      this.loadingTabla = false;
    },(({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingTabla = false;
    }));
  }

  // Actualizar estado
  actualizarEstado(unidad: UnidadMedida): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se esta por actualizar un estado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingTabla = true;
        this.unidadMedidaService.actualizarUnidad(unidad._id, { activo: !unidad.activo }).subscribe( () => {
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'Estado actualizado',
            timer: 1000,
            showConfirmButton: false
          });
          this.listarUnidades();          
        },(({ error }) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
          this.loadingTabla = false;
        }));
      }
    })  
  }
  
  // Reiniciar paginacion
  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;
    this.paginacion.limit = 10;
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.loadingTabla = true;
    this.filtro.activo = activo;
    this.reiniciarPaginacion();
    this.listarUnidades();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.loadingTabla = true;
    this.filtro.descripcion= descripcion;
    this.reiniciarPaginacion();
    this.listarUnidades();
  }

  // Funcion de paginación
  actualizarDesdeHasta(selector): void {
    this.loadingTabla = true;
  
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
  
    this.listarUnidades();

  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.loadingTabla = true;
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarUnidades();
  }

}
