import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Producto } from 'src/app/models/producto.model';
import { ProductosService } from '../../services/productos.service';
import { IngresoProductosService } from '../../services/ingreso-productos.service';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-nuevo-producto-ingreso',
  templateUrl: './nuevo-producto-ingreso.component.html',
  styles: [
  ]
})
export class NuevoProductoIngresoComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private alertService: AlertService,
              private dataService: DataService,
              private productosService: ProductosService,
              private ingresoProductosService: IngresoProductosService) { }

  public id;
  public productos = [];
  public producto: Producto;
  public productoSeleccionado = false;
  public ultimoIngresado = { codigo: '' }
  public descripcion = '';

  public total = 0;

  // Paginacion
  public paginacion = {
    limit: 5,
    desde: 0,
    hasta: 5
  }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Ingresos";
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.id = id;
    });
  }

  // Ingresar nuevo producto
  ingresarProducto(cantidad: any): void {

    if(cantidad.trim() == '' || Number(cantidad) < 0){
      this.alertService.info('Cantidad inválida');
      return;
    }

    const data = {
      ingreso: this.id,
      producto: this.producto._id,
      cantidad  
    }
    
    this.alertService.loading();

    this.ingresoProductosService.nuevoProducto(data).subscribe(()=>{
      this.alertService.success('Producto agregado correctamente');     
      this.productoSeleccionado = false;
      this.alertService.close();
      this.ultimoIngresado = this.producto;
      this.ultimoIngresado['cantidad'] = cantidad; 
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }
  
  // Listar productos
  listarProductos(): void {
    this.productosService.listarProductos(
      this.paginacion.hasta,
      this.paginacion.desde,
      true,
      this.descripcion,
      1,
      'codigo'
    ).subscribe(({ productos, total }) => {
      this.total = total;
      this.productos = productos;
      this.alertService.close();
    },({error}) => {
      this.alertService.errorApi(error.msg);
    });
  }

  // Seleccionar producto
  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = true;
    this.producto = producto;
    this.productos = [];
  }

   // Filtro por descripcion
   filtroDescripcion(descripcion: string): void {
    if(this.descripcion.trim() === '') this.productos = [];
    this.descripcion = descripcion;    
  }

  // Reiniciar paginación
  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 5;
    this.paginacion.limit = 5;
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

  // Buscar productos
  buscarProductos(): void {  
    if(this.descripcion.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }
    this.alertService.loading();
    this.reiniciarPaginacion();
    this.listarProductos();  
  }

  // Borrar proveedor seleccionado
  borrarProductoSeleccionado(){
    this.alertService.close();
    this.productoSeleccionado = false;
    this.productos = [];
  }

}
