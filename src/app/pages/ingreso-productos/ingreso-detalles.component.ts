import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { ProductosService } from '../../services/productos.service';
import { IngresosService } from '../../services/ingresos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso-detalles',
  templateUrl: './ingreso-detalles.component.html',
  styles: [
  ]
})
export class IngresoDetallesComponent implements OnInit {

  public limit = 3;
  public loading = true;
  public ingreso = {};
  public productos: Producto[] = [];
  public producto: Producto;
  public productoSeleccionado: false;

  constructor(private productosService: ProductosService,
              private ingresoService: IngresosService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {  
      this.ingresoService.getIngreso(id).subscribe( ({ ingreso }) => {
       this.ingreso = ingreso;
       this.loading = false;
      });  
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })      
    })
  }

  // Listar productos
  listarProductos(parametro: string): void {
    this.loading = true;
    this.productosService.listarProductos(
      this.limit,
      0,
      true,
      parametro
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
    });
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
