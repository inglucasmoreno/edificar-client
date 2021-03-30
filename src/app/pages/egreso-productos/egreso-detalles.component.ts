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
  public loadingCargando = false;
  public egreso = {};
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
        this.listarProductos();
        this.loading = false;
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

  // Listar productos de egreso
  listarProductos(): void {
    this.egresoProductosService.listarProductosPorEgreso(this.id).subscribe(({productos, total})=>{
      this.productos = productos;
      this.total = total;
      this.loadingCargando = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingCargando = false;
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
        this.egresoProductosService.completarEgreso(this.id).subscribe(() => {
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
        this.egresoProductosService.egresoParcial(producto).subscribe(()=>{
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
}
