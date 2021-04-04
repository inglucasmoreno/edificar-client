import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EgresoProductosService } from 'src/app/services/egreso-productos.service';
import Swal from 'sweetalert2';
import { EgresoService } from '../../services/egreso.service';

@Component({
  selector: 'app-egreso-detalles',
  templateUrl: './egreso-detalles.component.html',
  styles: [
  ]
})
export class EgresoDetallesComponent implements OnInit {

  public id;
  public total = 0;
  public loading = true;
  public loadingCargando = true;
  public egreso = {
    codigo_cadena: '',
    descripcion_cliente: ''
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
  public productos = [];

  constructor(private activatedRoute: ActivatedRoute,
              private egresosService: EgresoService,
              private egresoProductosService: EgresoProductosService,
              private router: Router
              ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => {
      this.id = id;
      this.egresosService.getEgreso(id).subscribe(({egreso}) => {
        this.egreso = egreso;
        this.primerIngreso();
      })         
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
    });
  };

  primerIngreso(): void {
    this.egresoProductosService.listarProductosPorEgreso(
      this.id,
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.activo
    ).subscribe(({productos, total})=>{
      this.productos = productos;
      this.total = total;
      total !== 0 ? this.tieneProductos = true : this.tieneProductos = false;
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
    })  
  }

  // Listar productos de egreso
  listarProductos(): void {
    this.egresoProductosService.listarProductosPorEgreso(
      this.id,
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.activo
    ).subscribe(({productos, total})=>{
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
    })
  }

  // Completar Egreso
  completarEgreso(): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Estas por completar el egreso",
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
          persona_empresa: this.egreso.descripcion_cliente,
          documento_codigo: this.egreso.codigo_cadena  
        };
        this.egresoProductosService.completarEgreso(this.id, data).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'Egreso completado correctamente',
            timer: 1000,
            showConfirmButton: false
          });
          this.loadingCargando = false;
          this.router.navigateByUrl('/dashboard/egreso_productos'); 
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

  // Egreso parcial
  egresoParcial(producto: string): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Estas por realizar un egreso",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Realizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCargando = true;
        const data = {
          persona_empresa: this.egreso.descripcion_cliente,
          documento_codigo: this.egreso.codigo_cadena  
        };
        this.egresoProductosService.egresoParcial(producto, data).subscribe(()=>{
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'Egreso realizado correctamente',
            timer: 1000,
            showConfirmButton: false
          });
          this.listarProductos();
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
        this.egresoProductosService.eliminarProducto(producto).subscribe(()=>{
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'Producto eliminado correctamente',
            timer: 1000,
            showConfirmButton: false
          });
          this.listarProductos();
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
    this.listarProductos();
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
    this.listarProductos();
  }
  
  // Se reestablecen los valores de paginacion
  reiniciarPaginacion(): void {
    this.paginacion.limit = 5;
    this.paginacion.desde = 0;
    this.paginacion.hasta = 5;  
  } 

}
