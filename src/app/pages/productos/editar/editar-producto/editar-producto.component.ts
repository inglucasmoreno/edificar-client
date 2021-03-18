import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnidadMedidaService } from '../../../../services/unidad-medida.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ProductosService } from '../../../../services/productos.service';
import { Producto } from 'src/app/models/producto.model';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styles: [
  ]
})
export class EditarProductoComponent implements OnInit {
s
  public unidades = [];
  public productoId = '';
  public stockMinimo = true;
  public loading = true;
  public producto: Producto = {
    _id: '',
    codigo: '',
    descripcion: '',
    unidad_medida: '',
    cantidad: 0,
    stock_minimo: false,
    cantidad_minima: 0,
    precio: 0,
    activo: true  
  };

  public productoForm = this.fb.group({
    codigo: ['', Validators.required],
    descripcion: ['', Validators.required],
    unidad_medida: ['', Validators.required],
    stock_minimo: [false, Validators.required],
    cantidad_minima: [0, Validators.required],
    precio: [0, Validators.required],
    activo: [true, Validators.required]
  });

  constructor(private activatedRoute: ActivatedRoute,
              private unidadMedidaService: UnidadMedidaService,
              private fb: FormBuilder,
              private productosService: ProductosService,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( async ({ id }) => {
      this.productoId = id;
      this.obtenerUnidades();
      this.obtenerProducto(id);  
    })
  }

  editarProducto(): void {
    if(this.productoForm.valid){ 
        this.loading = true;       
        const data = this.productoForm.value;
        if(!this.stockMinimo) data.cantidad_minima = 0;
        this.productosService.actualizarProducto(this.producto._id, data).subscribe(()=>{
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'Producto actualizado correctamente',
            timer: 1000,
            showConfirmButton: false
          });
          this.loading = false;
          this.router.navigateByUrl(`/dashboard/productos`);
        },({error}) =>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
          this.loading = false;
        });
    }else{
      Swal.fire({
        icon:'info',
        title: 'Información',
        text: 'Formulario invalido',
        confirmButtonText: 'Entendido'
      })  
      this.loading = false;
    }
  }

  obtenerProducto(id: string): void {
    this.productosService.getProducto(id).subscribe(({producto})=>{
      this.producto = producto;
      this.stockMinimo = producto.stock_minimo;
      this.loading = false;  
      this.productoForm.setValue({
        codigo: producto.codigo,
        descripcion: producto.descripcion,
        unidad_medida: producto.unidad_medida,
        stock_minimo: producto.stock_minimo,
        cantidad_minima: producto.cantidad_minima,
        precio: producto.precio,
        activo: producto.activo        
      }); 
    });
  }

  obtenerUnidades(): void {
    this.unidadMedidaService.listarUnidades(0, 0, true).subscribe( ({ unidades }) => {
      this.unidades= unidades; 
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })
    }); 
  }

}
