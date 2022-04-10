import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TrazabilidadService } from '../../services/trazabilidad.service';
import { ProductosService } from '../../services/productos.service';
import { ReportesService } from '../../services/reportes.service';
import { format } from 'date-fns';
import gsap from 'gsap';

import { saveAs } from 'file-saver-es'; 
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-trazabilidad',
  templateUrl: './trazabilidad.component.html',
  styles: [
  ]
})
export class TrazabilidadComponent implements OnInit {
  
  public total = 0;
  public inicio = true;
  
  public productos = [];
  public flagSeleccionado = false;
  public buscando = false;
  public trazabilidad = [];
  public registros: number = 5;

  // Paginación
  public paginacion = {
    limit: this.registros,
    desde: 0,
    hasta: this.registros
  };

  // Filtrado
  public filtro = {
    tipo: '',  
    producto: '',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  // Fechas
  public fecha = {
    antes: '',
    despues: ''
  }

  constructor(private trazabilidadService: TrazabilidadService,
              private dataService: DataService,
              private alertService: AlertService,
              private reportesService: ReportesService,
              private productosService: ProductosService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Trazabilidad";
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .5 });
    this.listarProductos();
  }

  // Reporte - Trazabilidad
  generarReporte(): void {
    this.alertService.question({ msg: 'Esta por generar un reporte', buttonText: 'Generar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        this.alertService.loading();   
        this.reportesService.trazabilidad(
          this.filtro.tipo,
          this.filtro.producto,
          this.filtro.parametro,
          this.ordenar.direccion,
          this.ordenar.columna,
          this.fecha.antes,
          this.fecha.despues      
        ).subscribe(archivoExcel => {
          this.alertService.close();
          saveAs(archivoExcel,`Trazabilidad ${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
        },({error})=>{
          this.alertService.errorApi(error.msg);   
        });  
      }
    }); 
  }

  // Listado de resulados
  listarTrazabilidad(): void {
    this.inicio = false;
    this.trazabilidadService.listarTrazabilidad(
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.tipo,
      this.filtro.producto,
      this.filtro.parametro,
      this.ordenar.direccion,
      this.ordenar.columna,
      this.fecha.antes,
      this.fecha.despues
    ).subscribe( ({ trazabilidad, total }) => {
      this.trazabilidad = trazabilidad;
      this.total = total;
      this.buscando = true;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
      this.inicio = false;
    });  
  }

  listarProductos(): void {
    this.productosService.listarProductos().subscribe(({productos}) => {
      this.productos = productos    
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Ordenar por fecha
  ordenarFecha(): void {
    this.alertService.loading();
    this.ordenar.direccion === 1 ? this.ordenar.direccion = -1 : this.ordenar.direccion = 1;
    this.listarTrazabilidad();
  }

  // Filtrar por tipo
  filtrarTipos(tipo: string): void{
    this.filtro.tipo = tipo;
  }

  // Filtrar por producto
  filtrarProducto(producto: string): void{
    this.filtro.producto = producto;
  }

  // Filtrar por Cliente o Proveedor
  filtrarParametro(parametro: string): void{
    this.filtro.parametro = parametro;
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
    this.listarTrazabilidad();
  }
  
  // Se reestablecen los valores de paginacion
  reiniciarPaginacion(): void {
    this.paginacion.limit = this.registros;
    this.paginacion.desde = 0;
    this.paginacion.hasta = this.registros;  
  } 

  // Buscar
  buscar(parametro: string, registros: number): void {
    this.alertService.loading();
    this.filtroParametro(parametro);
    this.registros = Number(registros);
    this.reiniciarPaginacion(); 
    this.listarTrazabilidad();
  }

  // Filtro por descripcion
  filtroParametro(parametro: string): void {
    this.filtro.parametro = parametro;
  }

  // Filtro por Fecha - Antes
  fechaAntes(fecha: string): void{
    this.fecha.antes = fecha;
  }

  // Fecha por Fecha - Despues
  fechaDespues(fecha: string): void{
    this.fecha.despues = fecha;
  }

}
