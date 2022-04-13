import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/models/proveedor.model';
import Swal from 'sweetalert2';
import { ProveedoresService } from '../../services/proveedores.service';
import { ReportesService } from '../../services/reportes.service';
import { format } from 'date-fns';

import { saveAs } from 'file-saver-es'; 
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styles: [
  ]
})
export class ProveedoresComponent implements OnInit {

  public total = 0;
  public proveedores: Proveedor[] = [];

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
    columna: 'razon_social'
  }

  constructor(private proveedoresService: ProveedoresService,
              private alertService: AlertService,
              private dataService: DataService,
              private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Proveedores";
    this.listarProveedores();
  }

  // Generar reporte de usuarios
  generarReporte(): void {

    this.alertService.question({ msg: 'Está por generar un reporte', buttonText: 'Generar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {

        this.alertService.loading();

        this.reportesService.proveedores(
          this.filtro.activo,
          this.filtro.descripcion,
          this.ordenar.direccion,
          this.ordenar.columna
        ).subscribe(archivoExcel => {
          this.alertService.close();
          saveAs(archivoExcel,`Proveedores ${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
        },({error})=>{
          this.alertService.errorApi(error.msg);
        }); 
      }
    });  
  }

  // Listar Proveedores
  listarProveedores(): void {
    this.alertService.loading();
    this.proveedoresService.listarProveedores(
      this.paginacion.limit,
      this.paginacion.desde,
      this.filtro.activo,
      this.filtro.descripcion,
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe(({proveedores, total}) => {
      this.proveedores = proveedores;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);  
    });
  }

  // Actualizar estado
  actualizarEstado(proveedor: Proveedor): void {
    this.alertService.question({ msg: 'Está por descargar la guía de usuario', buttonText: 'Descargar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        this.alertService.loading();
        this.proveedoresService.actualizarProveedor(proveedor._id, { activo: !proveedor.activo }).subscribe( () => {
          this.listarProveedores();          
        },(({ error }) => {
          this.alertService.errorApi(error.msg);
        }));
      }
    });  
  }

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
    this.listarProveedores();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.alertService.loading();
    this.filtro.descripcion= descripcion;
    this.reiniciarPaginacion();
    this.listarProveedores();
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
  
    this.listarProveedores();

  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarProveedores();
  }


}
