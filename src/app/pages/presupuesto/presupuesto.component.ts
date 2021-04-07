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
  public precioTotal = 0;
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

    if(txtCantidad.value.trim() === '' || txtCantidad.value === '0'){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debe colocar una cantidad valida',
        confirmButtonText: 'Entendido'
      })
      return;
    }else{

      const total = this.seleccionado.precio * txtCantidad.value;
      
      this.seleccionados.push({
        id: this.seleccionado._id,
        descripcion: this.seleccionado.descripcion,
        precio: this.seleccionado.precio,
        unidad_medida: this.seleccionado.unidad_medida.descripcion,
        cantidad: txtCantidad.value,
        total
      });
      this.precioTotalFnc();
      this.borrarProductoSeleccionado();
      this.productos = [];
      txtCantidad.value = '';
    
    }

  }

  // Se extra un elemento del arreglo
  extraerProducto(productoId: string): void {
    const productos = this.seleccionados.filter(elemento => elemento.id !== productoId);
    this.seleccionados = productos;
    this.precioTotalFnc();
  }

  // Se calcula el precio total del presupuesto
  precioTotalFnc(): void {
    let tmpTotal = 0;
    this.seleccionados.forEach(producto => {
      tmpTotal += Number.parseFloat(producto.total); 
    });
    this.precioTotal = tmpTotal;
  }

  // Seleccionar producto
  seleccionarProducto(producto: any): void {
    this.flagSeleccionado = true;
    this.seleccionado = producto;
    this.productos = [];
    console.log(producto);
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

  // Eliminar presupuesto
  eliminarPresupuesto(): void {
    this.seleccionados = [];
    this.precioTotal = 0;
  }

}
