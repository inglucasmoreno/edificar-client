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
  crearIngreso(numeroRemito: string): void {
    
    // Se verifica validacion de formulario
    if(numeroRemito.trim() == '' || !this.proveedorSeleccionado){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debe completar todos los campos',
        confirmButtonText: 'Entendido'
      });  
      return;
    }
    
    // Se crea nuevo ingreso  
    const data = {
      numero_remito: numeroRemito,
      razon_social_proveedor: this.proveedor.razon_social,
      cuit_proveedor: this.proveedor.cuit
    }

    this.loading = true;
    this.ingresosService.nuevoIngreso(data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'Nuevo ingreso creado correctamente',
        showConfirmButton: false,
        timer: 1000
      });  
      this.router.navigateByUrl('dashboard/ingreso_productos');
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      }),
      this.loading = false;
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

  // Buscando proveedores
  buscarProveedor(parametro: string): void {
    this.loading = true;
    this.descripcion = parametro;
    if(parametro.trim() !== ''){
      this.listarProveedores();
    }else{
      this.loading = false;
      this.proveedores = [];
    }
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
