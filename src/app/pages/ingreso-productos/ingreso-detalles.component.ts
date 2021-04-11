import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngresosService } from '../../services/ingresos.service';
import Swal from 'sweetalert2';
import { IngresoProductosService } from '../../services/ingreso-productos.service';

@Component({
  selector: 'app-ingreso-detalles',
  templateUrl: './ingreso-detalles.component.html',
  styles: [
  ]
})
export class IngresoDetallesComponent implements OnInit {

  public id;
  public total;

  // Loadings
  public loadingRemito = true;
  public loadingProductos = true;

  public loadingCargando = true;
  public loadingTabla = true;
  public loadingCompletar = false;
  
  public loading = true;
  public ingreso = {
    numero_remito: '',
    proveedor: '',
  };

  public filtro = {
    activo: ''
  }
  
  public paginacion = {
    limit: 5,
    desde: 0,
    hasta: 5
  }

  public tieneProductos: boolean;
  public productos = [];                  // Productos del ingreso

  constructor(private ingresoService: IngresosService,
              private activatedRoute: ActivatedRoute,
              private ingresoProductosService: IngresoProductosService,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {  
      this.id = id;
      this.ingresoService.getIngreso(id).subscribe( ({ ingreso }) => {
       this.ingreso = ingreso;
       this.loadingRemito = false;
       this.primerIngreso();
      });  
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingRemito = false;
    });
  }
  
  // Primer ingreso a la pagina
  primerIngreso(): void {
    this.ingresoProductosService.listarProductosPorIngreso(
      this.id,
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.activo
      ).subscribe( ({ productos, total }) => {
      this.productos = productos;
      this.total = total;
      total != 0 ? this.tieneProductos = true : this.tieneProductos = false;  // Indica que el ingreso tiene productos
      this.loadingProductos = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingProductos = false;
    });  
  }

  // Completar ingreso
  completarIngreso(): void {
    
    // Se verifica si el remito tiene productos
    if(this.productos.length <= 0){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'El ingreso no tiene productos',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    Swal.fire({
      title: '¿Estas seguro?',
      text: "Estas por completar el ingreso",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Completar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCargando = true;
        const data = {
          persona_empresa: this.ingreso.proveedor['razon_social'],
          documento_codigo: this.ingreso.numero_remito
        }
        this.ingresoProductosService.completarIngreso(this.id, data).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'Ingreso completado correctamente',
            timer: 1000,
            showConfirmButton: false
          });
          this.loadingCargando = false;
          this.router.navigateByUrl('/dashboard/ingreso_productos'); 
        },({error})=>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          })
          this.loading = false;
          this.loadingCargando = false;
        });
      }
    })
  }

  // Listar productos por ingreso
  listarProductosPorIngreso(): void {
    this.loadingCargando = true;
    this.ingresoProductosService.listarProductosPorIngreso(
      this.id,
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.activo
      ).subscribe( ({ productos, total }) => {
      this.productos = productos;
      this.total = total;
      this.loadingCargando = false;
      this.loading = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingCargando = false;
      this.loading = false;
    });
  }

  // Eliminar producto
  eliminarProducto(producto: string): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Estas por eliminar un producto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCargando = true;
        this.ingresoProductosService.eliminarProducto(producto).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'El producto fue eliminado',
            timer: 1000,
            showConfirmButton: false
          });
          this.listarProductosPorIngreso();  
        },({error})=>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          })        
        });
      }
    })
  }

  // Ingreso parcial de producto
  ingresoParcial(producto: string): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Estas por ingresar un producto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ingresar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCargando = true;
        const data = {
          persona_empresa: this.ingreso.proveedor['razon_social'],
          documento_codigo: this.ingreso.numero_remito
        }
        this.ingresoProductosService.ingresoParcial(producto, data).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'El producto fue ingresado',
            timer: 1000,
            showConfirmButton: false
          });
          this.listarProductosPorIngreso();  
        },({error})=>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
          this.loadingCargando = false;
        });
      }
    })
  }

  // Filtro por activo
  filtrarActivo(activo: any): void{
    this.loadingCargando = true;
    this.filtro.activo = activo;
    this.reiniciarPaginacion();
    this.listarProductosPorIngreso();
  }

  // Funcion de paginación
  actualizarDesdeHasta(selector): void {
    this.loadingCargando = true;
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
    this.listarProductosPorIngreso();
  }
  
  // Se reestablecen los valores de paginacion
  reiniciarPaginacion(): void {
    this.paginacion.limit = 5;
    this.paginacion.desde = 0;
    this.paginacion.hasta = 5;  
  } 

}
