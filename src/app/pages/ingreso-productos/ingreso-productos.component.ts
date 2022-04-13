import { Component, OnInit } from '@angular/core';
import { Ingreso } from '../../models/ingreso.model';
import { IngresosService } from '../../services/ingresos.service';
import { format } from 'date-fns';

import { saveAs } from 'file-saver-es'; 
import { ReportesService } from '../../services/reportes.service';
import { DataService } from 'src/app/services/data.service';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-ingreso-productos',
  templateUrl: './ingreso-productos.component.html',
  styles: [
  ]
})
export class IngresoProductosComponent implements OnInit {

  public total = 0;
  public ingresos: Ingreso[] = [];

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
  constructor(private ingresosService: IngresosService,
              private dataService: DataService,
              private alertService: AlertService,
              private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Ingresos";
    this.alertService.loading();
    this.listarIngresos();
  }

  // Generar reporte de ingresos
  generarReporte(): void {
    this.alertService.question({ msg: 'Está por generar un reporte', buttonText: 'Generar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.alertService.loading();
            this.reportesService.ingresos(
              this.filtro.estado,
              this.filtro.descripcion,
              this.ordenar.direccion,
              this.ordenar.columna  
            ).subscribe(archivoExcel => {
              this.alertService.close();
              saveAs(archivoExcel, `Ingresos ${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
            },({error})=>{
              this.alertService.errorApi(error.msg);
            }); 
          }
        }); 
  }

  listarIngresos(): void {
    this.ingresosService.listarIngresos(
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.estado,
      this.filtro.descripcion,
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe( ({ ingresos, total }) => {
      this.ingresos = ingresos;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;
    this.paginacion.limit = 10;    
  }

  // Filtro por Estado
   filtrarActivos(estado: string): void{
    this.alertService.loading();
    this.filtro.estado = estado;
    this.reiniciarPaginacion();
    this.listarIngresos();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.alertService.loading();
    this.filtro.descripcion= descripcion;
    this.reiniciarPaginacion();
    this.listarIngresos();
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
  
    this.listarIngresos();

  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarIngresos();
  }

}
