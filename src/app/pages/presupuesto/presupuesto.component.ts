import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styles: [
  ]
})
export class PresupuestoComponent implements OnInit {

  public loading = false;
  public total = 0;
  public productos: any = [];
  public seleccionados = [];
  public limit = 5;
  public descripcion = '';

  constructor(private productosService: ProductosService) { }

  ngOnInit(): void {}
  
  // Agregar producto
  agregarProducto(producto: any, txtDescripcion: any): void{
    this.seleccionados.push({
      descripcion: producto.descripcion,
      precio: producto.precio
    })
    this.productos = [];
    txtDescripcion.value = '';
  }

  // Listar productos
  buscarProducto(): void{
    this.productosService.listarProductos(
      this.limit,
      0,
      true,
      this.descripcion
    ).subscribe(({productos, total}) => {
      console.log(productos);
      this.total = total;
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

  // Filtro por descripcion
  filtroDescripcion(descripcion: string): void {
    if(descripcion.trim() === ''){
      this.productos = [];  
    }else{
      this.loading = true;
      this.descripcion = descripcion;
      this.buscarProducto();  
    }
  }

}
