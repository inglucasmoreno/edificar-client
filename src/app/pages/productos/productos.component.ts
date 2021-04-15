import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styles: [
  ]
})
export class ProductosComponent implements OnInit {
  
  public usuarioLogin;

  public total = 0;
  public loading = true;
  public productos = [];

  // Paginación
  public paginacion = {
    limit: 10,
    desde: 0,
    hasta: 10
  };

  // Filtrado
  public filtro = {
    descripcion: '',
    activo: true
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'codigo'
  }

  constructor(private productosService: ProductosService,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario;
    this.listarProductos();
  }

  // Listar productos
  listarProductos() {
    this.productosService.listarProductos(
      this.paginacion.hasta, 
      this.paginacion.desde, 
      this.filtro.activo, 
      this.filtro.descripcion,
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe( ({productos, total}) => {
      this.productos = productos;
      this.total = total;
      this.loading = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(producto: Producto): void {
    const { _id, activo } = producto;
    Swal.fire({
      title: '¿Estas seguro?',
      text: `¿Quieres actualizar el estado?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;  
        this.productosService.actualizarProducto(_id, {activo: !activo}).subscribe(() => {
          this.listarProductos();
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: `Estado actualizado`,
            showConfirmButton: false,
            timer: 1000
          });
          this.loading = false;
        }, ({error}) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
          this.loading = false;
        });
      }
    });

  }

  // Reiniciar paginación
  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;
    this.paginacion.limit = 10;
  }

  detalleProducto(id): void {
    if(this.usuarioLogin.role !== 'ADMIN_ROLE'){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'No tienes permiso para ingresar',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    this.router.navigateByUrl(`/dashboard/producto/${id}`);
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.loading = true;
    this.filtro.activo = activo;
    this.reiniciarPaginacion();
    this.listarProductos();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.loading = true;
    this.filtro.descripcion= descripcion;
    this.reiniciarPaginacion();
    this.listarProductos();
  }

  // Funcion de paginación
  actualizarDesdeHasta(selector): void {
    
    // this.loading = true;
    
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
  
  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.loading = true;
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarProductos();
  }

}
