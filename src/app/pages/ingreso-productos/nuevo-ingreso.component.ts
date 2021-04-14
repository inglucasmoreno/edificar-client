import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { IngresosService } from '../../services/ingresos.service';
import { Proveedor } from '../../models/proveedor.model';
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
  selector: 'app-nuevo-ingreso',
  templateUrl: './nuevo-ingreso.component.html',
  styles: [
  ]
})
export class NuevoIngresoComponent implements OnInit {

  public loading = false;
  public loadingFinal = false;
  public numero_remito = '';
  public proveedores: Proveedor[] = [];
  public proveedor: Proveedor;
  public proveedorSeleccionado = false;
  public limit = 3;
  public descripcion = '';

  constructor(private proveedoresService: ProveedoresService,
              private ingresosService: IngresosService,
              private router: Router) {}

  ngOnInit(): void {}

  // Nuevo ingreso
  crearIngreso(punto_venta: string, nro_comprobante: string): void {
    
    // Se verifica validacion de formulario
    if(punto_venta.trim() == '' || nro_comprobante.trim() == '' || !this.proveedorSeleccionado){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Formulario inválido',
        confirmButtonText: 'Entendido'
      });  
      return;
    }
    
    // Se crea nuevo ingreso  
    const data = {
      punto_venta,
      nro_comprobante,
      proveedor: this.proveedor._id,
    }

    this.loadingFinal = true;
    this.ingresosService.nuevoIngreso(data).subscribe(({ingreso}) => {
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'Nuevo ingreso creado correctamente',
        showConfirmButton: false,
        timer: 1000
      });
      this.loadingFinal = false;  
      this.router.navigateByUrl(`dashboard/ingreso_productos/detalles/${ingreso._id}`);
    },({error}) => {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      }),
      this.loadingFinal = false;
    });
  }

  // Listando proveedores
  listarProveedores(): void {
    this.loading = true;
    this.proveedoresService.listarProveedores(
      this.limit,        // Limite de valores
      0,                 // Desde el principio de la lista
      true,              // Solo los activos
      this.descripcion   // Descripcion para busqueda
    ).subscribe(({proveedores}) => {
      this.proveedores = proveedores;
      this.loading = false;
    },({error}) =>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })
      this.loading = false;
    });
  }

  // Buscar proveedores
  buscarProveedores(): void {  
    if(this.descripcion.trim() === ''){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Formulario inválido',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    this.listarProveedores();  
  }

  // Filtro por descripcion
  filtroDescripcion(descripcion: string): void {
    if(descripcion.trim() === '') this.proveedores = [];
    this.descripcion = descripcion; 
  }
  
  // Seleccionar proveedor
  seleccionarProveedor(proveedorSeleccionado: Proveedor): void {
    this.proveedorSeleccionado = true;
    this.proveedor = proveedorSeleccionado
  }

  // Borrar proveedor seleccionado
  borrarProveedorSeleccionado(){
    this.loading = false;
    this.proveedorSeleccionado = false;
    this.proveedores = [];
    this.proveedor = {
      razon_social: '',
      cuit: '',
      activo: false  
    };
  }

}
