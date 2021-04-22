import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Egreso } from '../../models/egreso.model';
import { EgresoService } from '../../services/egreso.service';
import { ReportesService } from '../../services/reportes.service';

import { format } from 'date-fns';
import { saveAs } from 'file-saver-es'; 

@Component({
  selector: 'app-egreso-productos',
  templateUrl: './egreso-productos.component.html',
  styles: [
  ]
})
export class EgresoProductosComponent implements OnInit {

  public total = 0;
  public loading = true;
  public egresos: Egreso[] = [];

  // Paginación
  public paginacion = {
    limit: 10,
    desde: 0,
    hasta: 10
  };

  // Filtrado
  public filtro = {
    descripcion: '',
    estado: 'Pendiente'
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  constructor(private egresoService: EgresoService,
              private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.listarEgresos();
  }

  // Generar reporte de egresos
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
    
        this.reportesService.egresos(
          this.filtro.estado,
          this.filtro.descripcion,
          this.ordenar.direccion,
          this.ordenar.columna       
        ).subscribe(archivoExcel => {
          Swal.close();
          saveAs(archivoExcel, `Egresos ${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
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
  
  // Listar egresos
  listarEgresos(): void {
    this.egresoService.listarEgresos(
      this.paginacion.limit,
      this.paginacion.desde,
      this.filtro.estado,
      this.filtro.descripcion,
      this.ordenar.direccion,
      this.ordenar.columna  
    ).subscribe( ({ egresos, total }) => {
      this.egresos = egresos;
      this.total = total;
      this.loading = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })
      this.loading = false;
    });
  }

  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;
    this.paginacion.limit = 10;
  }

  // Filtro por Estado
  filtrarActivos(estado: string): void{
    this.loading = true;
    this.filtro.estado = estado;
    this.reiniciarPaginacion();
    this.listarEgresos();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.loading = true;
    this.filtro.descripcion= descripcion;
    this.reiniciarPaginacion();
    this.listarEgresos();
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
  
    this.listarEgresos();

  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.loading = true;
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarEgresos();
  }

}
