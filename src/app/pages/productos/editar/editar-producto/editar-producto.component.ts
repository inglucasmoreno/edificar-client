import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnidadMedidaService } from '../../../../services/unidad-medida.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ProductosService } from '../../../../services/productos.service';
import { Producto } from 'src/app/models/producto.model';
import { DataService } from 'src/app/services/data.service';
import { AlertService } from 'src/app/services/alert.service';

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
              private dataService: DataService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private productosService: ProductosService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Productos - Editando"
    this.activatedRoute.params.subscribe( async ({ id }) => {
      this.productoId = id;
      this.alertService.loading();
      this.obtenerUnidades();
      this.obtenerProducto(id);  
    })
  }

  editarProducto(): void {

    const {codigo, descripcion, stock_minimo, cantidad_minima, precio} = this.productoForm.value;   
    
    const cantidadMinimaValida = stock_minimo && Number(cantidad_minima) < 0;

    if(cantidadMinimaValida){
      this.alertService.formularioInvalido();
      return;         
    }

    const formularioValido = this.productoForm.valid && 
                             codigo.trim() !== '' && 
                             descripcion.trim() !== '' && 
                             Number(precio) >= 0 

    if(formularioValido){ 
        this.alertService.loading();
        const data = this.productoForm.value;
        if(!this.stockMinimo) data.cantidad_minima = 0;
        this.productosService.actualizarProducto(this.producto._id, data).subscribe(()=>{
          this.alertService.close();
          this.router.navigateByUrl(`/dashboard/productos`);
        },({error}) =>{
          this.alertService.errorApi(error.msg);
        });
    }else{
      this.alertService.formularioInvalido();
    }
  }

  obtenerProducto(id: string): void {
    this.productosService.getProducto(id).subscribe(({producto})=>{
      this.producto = producto;
      this.stockMinimo = producto.stock_minimo;
      this.alertService.close();
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
      this.alertService.errorApi(error.msg);
    }); 
  }

}
