import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Producto } from 'src/app/models/producto.model';
import { ProductosService } from '../../services/productos.service';
import { IngresoProductosService } from '../../services/ingreso-productos.service';

@Component({
  selector: 'app-nuevo-producto-ingreso',
  templateUrl: './nuevo-producto-ingreso.component.html',
  styles: [
  ]
})
export class NuevoProductoIngresoComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private productosService: ProductosService,
              private ingresoProductosService: IngresoProductosService) { }

  public id;
  public loading = false;
  public loadingTabla = false;
  public loadingCreacion = false;
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
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.id = id;
    });
  }

  // Ingresar nuevo producto
  ingresarProducto(cantidad: any): void {

    if(cantidad.trim() == '' || Number(cantidad) < 0){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Cantidad inválida',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    const data = {
      ingreso: this.id,
      producto: this.producto._id,
      cantidad  
    }
    
    this.loadingCreacion = true;

    this.ingresoProductosService.nuevoProducto(data).subscribe(()=>{
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'Producto agregado correctamente',
        timer: 1000,
        showConfirmButton: false
      });      
      this.productoSeleccionado = false;
      this.loadingCreacion = false;
      this.ultimoIngresado = this.producto;
      this.ultimoIngresado['cantidad'] = cantidad; 
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });  
      this.loadingCreacion = false;
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
      this.loading = false;
      this.loadingTabla = false;
      this.loadingCreacion = false;  
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })
      this.loading = false;
      this.loadingTabla = false;
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
    this.listarProductos();
  }

  // Buscar productos
  buscarProductos(): void {  
    if(this.descripcion.trim() === ''){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Formulario inválido',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    this.loading = true;
    this.reiniciarPaginacion();
    this.listarProductos();  
  }

  // Borrar proveedor seleccionado
  borrarProductoSeleccionado(){
    this.loading = false;
    this.productoSeleccionado = false;
    this.productos = [];
  }

}
