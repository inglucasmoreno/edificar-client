import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public loading = true;
  public ingreso = {};
  public productos = [];

  constructor(private ingresoService: IngresosService,
              private activatedRoute: ActivatedRoute,
              private ingresoProductosService: IngresoProductosService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {  
      this.id = id;
      this.ingresoService.getIngreso(id).subscribe( ({ ingreso }) => {
       this.ingreso = ingreso;
       this.loading = false;
       this.listarProductosPorIngreso();
      });  
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })      
    })
  }

  // Listar productos por ingreso
  listarProductosPorIngreso(): void {
    this.ingresoProductosService.listarProductosPorIngreso(this.id).subscribe( ({ productos, total }) => {
      this.productos = productos;
      this.total = total;
      console.log(productos);
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })  
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
        this.ingresoProductosService.ingresoParcial(producto).subscribe(() => {
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
          })        
        });
      }
    })
  }

}
