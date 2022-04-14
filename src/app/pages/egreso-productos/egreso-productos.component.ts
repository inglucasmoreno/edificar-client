import { Component, OnInit } from '@angular/core';
import { Egreso } from '../../models/egreso.model';
import { EgresoService } from '../../services/egreso.service';
import { ReportesService } from '../../services/reportes.service';

import { format } from 'date-fns';
import { saveAs } from 'file-saver-es'; 
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-egreso-productos',
  templateUrl: './egreso-productos.component.html',
  styles: [
  ]
})
export class EgresoProductosComponent implements OnInit {

  public total = 0;
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
              private alertService: AlertService,
              private dataService: DataService,
              private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Egresos";
    this.alertService.loading();
    this.listarEgresos();
  }

  // Generar reporte de egresos
  generarReporte(): void {
  
    this.alertService.question({ msg: 'Está por generar un reporte', buttonText: 'Generar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.alertService.loading();    
            this.reportesService.egresos(
              this.filtro.estado,
              this.filtro.descripcion,
              this.ordenar.direccion,
              this.ordenar.columna       
            ).subscribe(archivoExcel => {
              this.alertService.close();
              saveAs(archivoExcel, `Egresos ${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
            },({error})=>{
              this.alertService.errorApi(error.msg);
            }); 
          }
        });  
    
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
    this.listarEgresos();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.alertService.loading();
    this.filtro.descripcion= descripcion;
    this.reiniciarPaginacion();
    this.listarEgresos();
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
  
    this.listarEgresos();

  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarEgresos();
  }

}
