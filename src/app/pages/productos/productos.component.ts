import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { ReportesService } from '../../services/reportes.service';
import { format } from 'date-fns';

import { saveAs } from 'file-saver-es'; 
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styles: [
  ]
})
export class ProductosComponent implements OnInit {
  
  public usuarioLogin;

  public total = 0;
  public productos = [];

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
    columna: 'codigo'
  }

  constructor(private productosService: ProductosService,
              private dataService: DataService,
              private alertService: AlertService,
              private authService: AuthService,
              private reportesService: ReportesService,
              private router: Router) {}

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Productos';
    this.usuarioLogin = this.authService.usuario;
    this.alertService.loading();
    this.listarProductos();
  }

  // Generar reporte de usuarios
  generarReporte(): void {
    this.alertService.question({ msg: 'Está por generar un reporte', buttonText: 'Generar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        this.alertService.loading();
        this.reportesService.productos(
          this.filtro.activo, 
          this.filtro.descripcion,
          this.ordenar.direccion,
          this.ordenar.columna
        ).subscribe(archivoExcel => {
          this.alertService.close();
          saveAs(archivoExcel, `Productos ${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
        },({error})=>{
          this.alertService.errorApi(error.msg);
        }); 
      }
    }); 
  }
  
  // Listar productos
  listarProductos() {
    this.productosService.listarProductos(
      this.paginacion.hasta, 
      this.paginacion.desde, 
      this.filtro.activo, 
      this.filtro.descripcion,
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe( ({productos, total}) => {
      this.productos = productos;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }
  
  // Reiniciar paginación
  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;
    this.paginacion.limit = 10;
  }

  detalleProducto(id): void {
    if(this.usuarioLogin.role !== 'ADMIN_ROLE'){
      this.alertService.info('No tienes permisos para ingresar');
      return;
    }
    this.router.navigateByUrl(`/dashboard/producto/${id}`);
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.alertService.loading();
    this.filtro.activo = activo;
    this.reiniciarPaginacion();
    this.listarProductos();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.alertService.loading();
    this.filtro.descripcion= descripcion;
    this.reiniciarPaginacion();
    this.listarProductos();
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
    
    this.listarProductos();
  
  }
  
  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarProductos();
  }

}
