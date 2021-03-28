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
  public loadingCreacion = false;
  public limit = 10;
  public productos = [];
  public producto: Producto;
  public productoSeleccionado = false;
  public ultimoIngresado = { codigo: '' }

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
  listarProductos(parametro: string): void {
    this.loading = true;
    this.productosService.listarProductos(
      this.limit,
      0,
      true,
      parametro,
      1,
      'codigo'
    ).subscribe(({ productos }) => {
      this.productos = productos;
      this.loading = false;  
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })
      this.loading = false;  
    });
  }

  // Seleccionar producto
  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = true;
    this.producto = producto;
    this.productos = [];
  }

  // Buscar productos
  buscarProductos(parametro): void {
    if(parametro.trim() != ''){
      this.listarProductos(parametro);  
    }else{
      this.productos = [];
    } 
  }

  // Borrar proveedor seleccionado
  borrarProductoSeleccionado(){
    this.loading = false;
    this.productoSeleccionado = false;
    this.productos = [];
  }

}
