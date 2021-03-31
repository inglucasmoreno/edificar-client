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
  public loadingCreacion = false;
  public limit = 10;
  public productos = [];
  public producto: Producto;
  public productoSeleccionado = false;
  public ultimoIngresado = { codigo: '' }

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
