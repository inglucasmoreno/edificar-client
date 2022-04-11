import { Component, OnInit } from '@angular/core';
import { UnidadMedidaService } from '../../../services/unidad-medida.service';
import  { UnidadMedida } from '../../../models/unidad-medida.model';
import { ReportesService } from '../../../services/reportes.service';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es'; 
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-unidad-medida',
  templateUrl: './unidad-medida.component.html',
  styles: [
  ]
})
export class UnidadMedidaComponent implements OnInit {

  public total = 0;
  public unidades: UnidadMedida[] = [];

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

  public modo = 'crear';
  public descripcion = '';
  public unidadSeleccionada: any;
  public showModal = false;

  constructor(private unidadMedidaService: UnidadMedidaService,
              private dataService: DataService,
              private alertService: AlertService,
              private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Unidades de medida";
    this.alertService.loading();
    this.listarUnidades(); 
  }

  // Generar reporte de usuarios
  generarReporte(): void {
    this.alertService.question({ msg: 'Está por generar un reporte', buttonText: 'Actualizar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        this.alertService.loading();
        this.reportesService.unidades(
          this.filtro.activo,
          this.filtro.descripcion,
          this.ordenar.direccion,
          this.ordenar.columna
        ).subscribe(archivoExcel => {
          this.alertService.close();
          saveAs(archivoExcel,`Unidades ${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
        },({error})=>{
          this.alertService.errorApi(error.msg);
        });         
      }
    });  
  }

  // Nueva unidad
  nuevaUnidad(): void {
    const descripcion = this.descripcion;
    if(descripcion.trim() === ''){
      this.alertService.info('Formulario inválido');
      return;
    }
    this.descripcion = '';
    this.alertService.loading();
    this.unidadMedidaService.nuevaUnidad({ descripcion }).subscribe( () => {
    this.showModal = false;
    this.listarUnidades();
    },(({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }

  // Listar unidades
  listarUnidades(): void {
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
      this.alertService.close();
    },(({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }

  // Actualizar estado
  actualizarEstado(unidad: UnidadMedida): void {
    this.alertService.question({ msg: 'Está por actualizar un estado', buttonText: 'Actualizar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        this.alertService.loading();
        this.unidadMedidaService.actualizarUnidad(unidad._id, { activo: !unidad.activo }).subscribe( () => {
          this.listarUnidades();          
        },(({ error }) => {
          this.alertService.errorApi(error.msg);
        }));        
      }
    });  
  }

  modalNuevaUnidad(): void {
    this.modo = "crear";
    this.descripcion = "";
    this.unidadSeleccionada = null;
    this.showModal = true;  
  }

  // Seleccionar unidad
  seleccionarUnidad(unidad: any): void {
    this.modo = "editar";
    this.descripcion = unidad.descripcion;
    this.unidadSeleccionada = unidad;
    this.showModal = true;
  }

  // Actualizar unidad
  actualizarUnidad(): void {
    
    const descripcion = this.descripcion;
    
    if(descripcion.trim() === ''){
      this.alertService.info('Formulario inválido');
      return;
    }
    
    this.alertService.loading();
   
    this.unidadMedidaService.actualizarUnidad(this.unidadSeleccionada._id, {descripcion: this.descripcion}).subscribe( () => {
      this.listarUnidades();
    },(({error}) => {
      this.alertService.errorApi(error.msg);
    }));

    this.showModal = false;

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
    this.listarUnidades();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.alertService.loading();
    this.filtro.descripcion= descripcion;
    this.reiniciarPaginacion();
    this.listarUnidades();
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
  
    this.listarUnidades();

  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarUnidades();
  }

}
