import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { EgresoProductosService } from 'src/app/services/egreso-productos.service';
import { ProductosService } from 'src/app/services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-producto-egreso',
  templateUrl: './nuevo-producto-egreso.component.html',
  styles: [
  ]
})
export class NuevoProductoEgresoComponent implements OnInit {

  public id;
  public loading = false;
  public loadingTabla = false;
  public loadingCreacion = false;
  public limit = 5;
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

  constructor(private activatedRoute: ActivatedRoute,
              private productosService: ProductosService,
              private egresoProductoService: EgresoProductosService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.id = id;
    });
  }

  // Egregar producto a egreso
  nuevoProducto(cantidad: any): void {
    if(cantidad.trim() == '' || Number(cantidad) < 0){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Cantidad inválida',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if(Number(cantidad) > this.producto.cantidad){
      Swal.fire({
        title: '¿Estas seguro?',
        text: "La cantidad es superior al disponible",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.crearProducto(cantidad);
        }
      })
    }else{
      this.crearProducto(cantidad);
    }
  }
  
  // Se agrega el producto al egreso
  crearProducto(cantidad: any): void {
    const data = {
      egreso: this.id,
      producto: this.producto._id,
      cantidad  
    }
    
    this.loadingCreacion = true;
    this.egresoProductoService.nuevoProducto(data).subscribe(()=>{
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'Producto agregado correctamente',
        timer: 1000,
        showConfirmButton: false
      });
      this.productos = [];
      this.productoSeleccionado = false;
      this.ultimoIngresado = this.producto;
      this.ultimoIngresado['cantidad'] = cantidad; 
      this.loadingCreacion = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })  
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

  // Filtro por descripcion
  filtroDescripcion(descripcion: string): void {
    if(descripcion.trim() === '') this.productos = [];
    this.descripcion = descripcion;    
  }

  // Borrar proveedor seleccionado
  borrarProductoSeleccionado(){
    this.loading = false;
    this.productoSeleccionado = false;
    this.productos = [];
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

}
