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
  public seleccionado: any = {};
  public flagSeleccionado: boolean;
  public seleccionados = [];
  public limit = 5;
  public descripcion = '';

  constructor(private productosService: ProductosService) { }

  ngOnInit(): void {}
  
  // Agregar producto al presupuesto
  agregarProducto(txtCantidad: any): void{

    if(txtCantidad.value.trim() === ''){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debe colocar una cantidad valida',
        confirmButtonText: 'Entendido'
      })
      return;
    }else{

      const total = new Intl.NumberFormat('es-AR',{
        minimumFractionDigits: 2  
      }).format( this.seleccionado.precio * txtCantidad.value );

      this.seleccionados.push({
        descripcion: this.seleccionado.descripcion,
        precio: this.seleccionado.precio,
        unidad_medida: this.seleccionado.unidad_medida.descripcion,
        cantidad: txtCantidad.value,
        total
      })
      this.borrarProductoSeleccionado();
      this.productos = [];
      txtCantidad.value = '';
    }

  }

  // Seleccionar producto
  seleccionarProducto(producto: any, txtDescripcion: any): void {
    this.flagSeleccionado = true;
    this.seleccionado = producto;
    this.productos = [];
    txtDescripcion.value = '';
  }

  // Eliminar producto seleccionado
  borrarProductoSeleccionado(): void {
    this.seleccionado = {};
    this.flagSeleccionado = false;  
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
