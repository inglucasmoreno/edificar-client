import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductosService } from '../../services/productos.service';
import { PresupuestosService } from '../../services/presupuestos.service';
import { environment } from '../../../environments/environment';

const base_url = environment.base_url;

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styles: [
  ]
})
export class PresupuestoComponent implements OnInit {

  // Fecha
  public fechaHoy = Date.now();

  // Loadings
  public loading = false;
  public loadingTabla = false;

  // Datos de cliente
  public cliente = {
    descripcion: '',
    tipoIdentificacion: 'DNI',
    identificacion: ''
  };

  // Variables de producto
  public total = 0;
  public loadingPDF = false;
  public precioTotal = 0;
  public productos: any = [];
  public seleccionado: any = {};
  public flagSeleccionado: boolean;
  public seleccionados = [];
  public limit = 5;
  public descripcion = '';

  // Paginacion
  public paginacion = {
    limit: 5,
    desde: 0,
    hasta: 5
  }

  constructor(private productosService: ProductosService,
              private presupuestosService: PresupuestosService) { }

  ngOnInit(): void {}
  
  // Cargando datos de cliente
  datosCliente(data: string, selector: string): void{
    this.cliente[selector] = data.toUpperCase();
  }

  // Se el presupuesto
  crearPresupuesto(): void {

    if(this.cliente.descripcion.trim() === '' || this.cliente.identificacion.trim() === ''){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debe completar los datos del cliente',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    const data = {
      cliente: this.cliente,
      productos: this.seleccionados
    }
    this.loadingPDF = true;
    this.presupuestosService.generarPresupuesto(data).subscribe( resp => {
      this.loadingPDF = false;
      window.open(`${base_url}/presupuestos`, '_blank');  
    },({error}) => {
      this.loadingPDF = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });  
    });
  }

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
    // Se controla si el producto ya esa en el presupuesto
    const existe = this.seleccionados.find(elemento => elemento.id == producto._id);
    if(existe){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Este producto ya esta agregado',
        confirmButtonText: 'Entendido'
      });
      this.productos = [];
    }else{
      this.flagSeleccionado = true;
      this.seleccionado = producto;
      this.productos = [];
    }
  }

  // Eliminar producto seleccionado
  borrarProductoSeleccionado(): void {
    this.seleccionado = {};
    this.flagSeleccionado = false;  
  }

  // Listar productos
  buscarProducto(): void{
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

  // Listar productos
  listarProductos(): void {
    this.productosService.listarProductos(
      this.paginacion.hasta,
      this.paginacion.desde,
      true,
      this.descripcion
    ).subscribe(({productos, total}) => {
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
      });
      this.loading = false;
      this.loadingTabla = false;
    });
  }

  // Filtro por descripcion
  filtroDescripcion(descripcion: string): void {
    if(descripcion.trim() === '') this.productos = [];
    this.descripcion = descripcion;      
  }

  // Eliminar presupuesto
  eliminarPresupuesto(): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Estas por eliminar el presupuesto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.seleccionados = [];
        this.precioTotal = 0;
      }
    })
  }

  // Borrar listado
  borrarListado(): void {
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
