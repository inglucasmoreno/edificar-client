import { Component, OnInit } from '@angular/core';
import { Proveedor } from '../../models/proveedor.model';
import { ProveedoresService } from '../../services/proveedores.service';
import Swal from 'sweetalert2';

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

  constructor(private proveedoresService: ProveedoresService) {}

  ngOnInit(): void {

  }

  crearIngreso(numeroRemito: string): void {
    if(numeroRemito.trim() == '' || !this.proveedorSeleccionado){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debe completar todos los campos',
        confirmButtonText: 'Entendido'
      });  
      return;
    }
    console.log('Creando ingreso');
  }

  listarProveedores(): void {
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
    });
  }

  buscarProveedor(parametro: string): void {
    this.loading = true;
    this.descripcion = parametro;
    if(parametro.trim() !== ''){
      this.listarProveedores();
    }else{
      this.proveedores = [];
    }
  }

  seleccionarProveedor(proveedorSeleccionado: Proveedor): void {
    this.proveedorSeleccionado = true;
    this.proveedor = proveedorSeleccionado
  }

  borrarProveedorSeleccionado(){
    this.proveedorSeleccionado = false;
    this.proveedores = [];
    this.proveedor = {
      razon_social: '',
      cuit: '',
      activo: false  
    };
  }

}
