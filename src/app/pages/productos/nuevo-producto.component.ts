import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UnidadMedidaService } from '../../services/unidad-medida.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styles: [
  ]
})
export class NuevoProductoComponent implements OnInit {

  public loading = true;
  public stockMinimo = false;
  public unidades = [];

  public productoForm = this.fb.group({
    codigo: ['', Validators.required],
    descripcion: ['', Validators.required],
    unidad_medida: ['', Validators.required],
    cantidad: [0, Validators.required],
    stock_minimo: [false, Validators.required],
    cantidad_minima: [0, Validators.required],
    precio: [0, Validators.required],
    activo: [true, Validators.required]
  });
  
  constructor(private fb: FormBuilder,
              private unidadMedidaService: UnidadMedidaService,
              private productosService: ProductosService
    ) { }

  ngOnInit(): void {
    this.obtenerUnidades();
  }
  
  crearProducto(): void {
    if(this.productoForm.valid){
      this.loading = true;
      const data = this.productoForm.value;
      if(!this.stockMinimo) data['cantidad_minima'] = 0;
      this.productosService.nuevoProducto(data).subscribe( () => {
        Swal.fire({
          icon: 'success',
          title: 'Completado',
          text: 'Producto creado correctamente',
          timer: 1000,
          showConfirmButton: false
        });
        this.reiniciarFormulario();  
        this.loading = false;
      },({error}) => {
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
        icon: 'info',
        title: 'Información',
        text: 'Formulario invalido',
        confirmButtonText: 'Entendido'
      });
    }
  }

  obtenerUnidades(): void {
    this.unidadMedidaService.listarUnidades(0, 0, true).subscribe( ({ unidades }) => {
      this.unidades= unidades; 
      this.reiniciarFormulario();
      this.loading = false;  
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })
      this.loading = false;  
    }); 
  }

  reiniciarFormulario() {
    this.productoForm.setValue({
      codigo: '',
      descripcion: '',
      unidad_medida: this.unidades[0]._id,
      cantidad: 0,
      stock_minimo: false,
      cantidad_minima: 0,
      precio: 0,
      activo: true
    })  
  }

}
