import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { EgresoProductosService } from 'src/app/services/egreso-productos.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-nuevo-producto-egreso',
  templateUrl: './nuevo-producto-egreso.component.html',
  styles: [
  ]
})
export class NuevoProductoEgresoComponent implements OnInit {

  public id;
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
              private alertService: AlertService,
              private dataService: DataService,
              private productosService: ProductosService,
              private egresoProductoService: EgresoProductosService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Egresos';
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.id = id;
    });
  }

  // Egregar producto a egreso
  nuevoProducto(cantidad: any): void {
    if(cantidad.trim() == '' || Number(cantidad) < 0){
      this.alertService.info('Cantidad inválida');
      return;
    }

    if(Number(cantidad) > this.producto.cantidad){
      this.alertService.question({ msg: 'La cantidad es superior al disponible', buttonText: 'Aceptar' })
      .then(({isConfirmed}) => {  
        if (isConfirmed) {
          this.crearProducto(cantidad);
        }
      });  
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
    
    this.alertService.loading();

    this.egresoProductoService.nuevoProducto(data).subscribe(()=>{
      this.productos = [];
      this.productoSeleccionado = false;
      this.ultimoIngresado = this.producto;
      this.ultimoIngresado['cantidad'] = cantidad; 
      this.alertService.success('Producto agregado correctamente');
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

  // Filtro por descripcion
  filtroDescripcion(descripcion: string): void {
    if(descripcion.trim() === '') this.productos = [];
    this.descripcion = descripcion;    
  }

  // Borrar proveedor seleccionado
  borrarProductoSeleccionado(){
    this.alertService.close();
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

}
