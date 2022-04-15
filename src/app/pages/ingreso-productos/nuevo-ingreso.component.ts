import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IngresosService } from '../../services/ingresos.service';
import { Proveedor } from '../../models/proveedor.model';
import { ProveedoresService } from '../../services/proveedores.service';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-nuevo-ingreso',
  templateUrl: './nuevo-ingreso.component.html',
  styles: [
  ]
})
export class NuevoIngresoComponent implements OnInit {

  // Modal
  public showModal = false;

  public numero_remito = '';
  public proveedores: Proveedor[] = [];
  public proveedor: Proveedor;
  public proveedorSeleccionado = false;
  public limit = 3;
  public descripcion = '';

  constructor(private proveedoresService: ProveedoresService,
              private dataService: DataService,
              private alertService: AlertService,
              private ingresosService: IngresosService,
              private router: Router) {}

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Ingresos - Creando';
  }

  // Nuevo ingreso
  crearIngreso(punto_venta: string, nro_comprobante: string): void {
    
    // Se verifica validacion de formulario
    if(punto_venta.trim() == '' || nro_comprobante.trim() == '' || !this.proveedorSeleccionado){
      this.alertService.formularioInvalido();
      return;
    }
    
    // Se crea nuevo ingreso  
    const data = {
      punto_venta,
      nro_comprobante,
      proveedor: this.proveedor._id,
    }

    this.alertService.loading();
    this.ingresosService.nuevoIngreso(data).subscribe(({ingreso}) => {
      this.alertService.close();
      this.router.navigateByUrl(`dashboard/ingreso_productos/detalles/${ingreso._id}`);
    },({error}) => {
      this.alertService.errorApi(error.msg);
    });
  }

  // Listando proveedores
  listarProveedores(): void {
    this.alertService.loading();
    this.proveedoresService.listarProveedores(
      this.limit,        // Limite de valores
      0,                 // Desde el principio de la lista
      true,              // Solo los activos
      this.descripcion   // Descripcion para busqueda
    ).subscribe(({proveedores}) => {
      this.proveedores = proveedores;
      this.alertService.close();
      this.showModal = true;
    },({error}) =>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Buscar proveedores
  buscarProveedores(): void {  
    if(this.descripcion.trim() === ''){
      this.alertService.formularioInvalido();
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
    this.showModal = false;
  }

  // Borrar proveedor seleccionado
  borrarProveedorSeleccionado(){
    this.alertService.close();
    this.proveedorSeleccionado = false;
    this.proveedores = [];
    this.proveedor = {
      razon_social: '',
      cuit: '',
      activo: false  
    };
    this.showModal = false;
  }

}
