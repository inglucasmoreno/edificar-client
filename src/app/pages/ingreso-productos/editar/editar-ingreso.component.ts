import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngresosService } from '../../../services/ingresos.service';
import { ProveedoresService } from '../../../services/proveedores.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-editar-ingreso',
  templateUrl: './editar-ingreso.component.html',
  styles: [
  ]
})
export class EditarIngresoComponent implements OnInit {

  // Modal
  public showModal = false;

  public id: string;
  public ingreso = {};
  public proveedor = {
    _id: '',
    razon_social: '',
    cuit: '',
    activo: false,
    domicilio: ''
  };
  public proveedorSeleccionado = true;
  public proveedores = [];
  public descripcion = '';
  public limit = 3;

  public ingresoForm = this.fb.group({
    punto_venta: ['', Validators.required],
    numero_comprobante: ['', Validators.required],
  });

  constructor(private activatedRoute: ActivatedRoute,
              private dataService: DataService,
              private alertService: AlertService,
              private ingresosService: IngresosService,
              private proveedoresService: ProveedoresService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Ingresos - Editando";
    this.activatedRoute.params.subscribe(({id})=>{
      this.id = id;
      this.alertService.loading();
      this.ingresosService.getIngreso(id).subscribe(({ingreso})=>{
        this.ingreso = ingreso;
        const tempRemito = ingreso.numero_remito.split('-');
        this.ingresoForm.setValue({
          punto_venta: tempRemito[0],
          numero_comprobante: tempRemito[1],
        });
        this.proveedoresService.getProveedor(ingreso.proveedor._id).subscribe(({proveedor})=>{
          this.proveedor = proveedor;
          this.alertService.close();
        },({error})=>{
          this.alertService.errorApi(error.msg);          
        })
      },({error})=>{
        this.alertService.errorApi(error.msg);
      });
    })
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

  // Seleccionar proveedor
  seleccionarProveedor(proveedorSeleccionado: any): void {
    this.proveedorSeleccionado = true;
    this.proveedor = proveedorSeleccionado;
    this.showModal = false;
  }

  // Borrar proveedor seleccionado
  borrarProveedorSeleccionado(){
    this.alertService.close();
    this.proveedorSeleccionado = false;
    this.proveedores = [];
    this.proveedor = {
      _id: '',
      razon_social: '',
      cuit: '',
      activo: false,
      domicilio: '' 
    };
    this.showModal = false;
  }

  // Filtro por descripcion
  filtroDescripcion(descripcion: string): void {
    if(descripcion.trim() === '') this.proveedores = [];
    this.descripcion = descripcion; 
  }

  // Actualizar ingreso
  actualizarIngreso(): void {

    const { punto_venta, numero_comprobante } = this.ingresoForm.value;
    const formularioValido = punto_venta.trim() !== '' && numero_comprobante.trim() !== '' && this.ingresoForm.valid && this.proveedorSeleccionado;

    if(formularioValido){
      this.alertService.loading();
      const data = {
        numero_remito: `${this.ingresoForm.value.punto_venta}-${this.ingresoForm.value.numero_comprobante}`,
        proveedor: this.proveedor._id,
      };
      this.ingresosService.actualizarIngreso(this.id, data).subscribe(()=>{
        this.alertService.close();
        this.router.navigateByUrl(`/dashboard/ingreso_productos/detalles/${this.id}`);
      },({error}) => {
        this.alertService.errorApi(error.msg);
      });
    }else{
      this.alertService.formularioInvalido();
    }
  }

}
