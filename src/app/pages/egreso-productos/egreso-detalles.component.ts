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

  public totalGeneral;

  // Loadings
  public loadingNota = true;
  public loadingProductos = true;
  public loadingTabla = false;
  public loadingCompletar = false;

  // Egreso
  public egreso = {
    codigo_cadena: '',
    descripcion_cliente: ''
  };

  // Filtrado
  public filtro = {
    activo: ''
  }
  
  // Paginaciion
  public paginacion = {
    limit: 5,
    desde: 0,
    hasta: 5
  }
  
  public productos = [];

  constructor(private activatedRoute: ActivatedRoute,
              private egresosService: EgresoService,
              private egresoProductosService: EgresoProductosService,
              private router: Router
              ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => {
      this.id = id;
      this.egresosService.getEgreso(id).subscribe(({ egreso }) => {
        this.egreso = egreso;
        this.loadingNota = false;
        this.primerIngreso();
      },({error}) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
          confirmButtonText: 'Entendido'
        });
        this.loadingNota = false;        
      })         
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingNota = false;
    });
  };

  // Primer ingreso a la vista
  primerIngreso(): void {
    this.egresoProductosService.listarProductosPorEgreso(
      this.id,
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.activo
    ).subscribe(({productos, total, totalGeneral})=>{
      this.totalGeneral = totalGeneral;
      this.productos = productos;
      this.total = total;
      this.loadingProductos = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingProductos = false;
    })  
  }

  // Listar productos de egreso
  listarProductos(): void {
    this.loadingTabla = true;
    this.egresoProductosService.listarProductosPorEgreso(
      this.id,
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.activo
    ).subscribe(({productos, total, totalGeneral})=>{
      this.totalGeneral = totalGeneral;
      this.productos = productos;
      this.total = total;
      this.loadingTabla = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingTabla = false;
    })
  }

  // Completar Egreso
  completarEgreso(): void {

    // Se verifica si la nota de venta tiene productos
    if(this.totalGeneral <= 0){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'El egreso no tiene productos',
        confirmButtonText: 'Entendido'
      });
      return;
    }

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
        this.loadingCompletar= true;
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
          this.loadingCompletar = false;
          this.router.navigateByUrl('/dashboard/egreso_productos'); 
        },({error})=>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
          this.loadingCompletar = false;
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
        this.loadingTabla = true;
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
          this.loadingTabla = false;
        });    
      }
    })
  }

  // Filtro por activo
  filtrarActivo(activo: any): void{
    this.loadingTabla = true;
    this.filtro.activo = activo;
    this.reiniciarPaginacion();
    this.listarProductos();
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
  
  // Se reestablecen los valores de paginacion
  reiniciarPaginacion(): void {
    this.paginacion.limit = 5;
    this.paginacion.desde = 0;
    this.paginacion.hasta = 5;  
  } 

}
