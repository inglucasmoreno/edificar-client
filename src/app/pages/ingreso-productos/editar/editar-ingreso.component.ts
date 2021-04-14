import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { IngresosService } from '../../../services/ingresos.service';
import { ProveedoresService } from '../../../services/proveedores.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-ingreso',
  templateUrl: './editar-ingreso.component.html',
  styles: [
  ]
})
export class EditarIngresoComponent implements OnInit {

  public id: string;
  public ingreso = {};
  public loading = false;
  public loadingInicial = true;
  public loadingFinal = false;
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
              private ingresosService: IngresosService,
              private proveedoresService: ProveedoresService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id})=>{
      this.id = id;
      this.ingresosService.getIngreso(id).subscribe(({ingreso})=>{
        this.ingreso = ingreso;
        const tempRemito = ingreso.numero_remito.split('-');
        this.ingresoForm.setValue({
          punto_venta: tempRemito[0],
          numero_comprobante: tempRemito[1],
        });
        this.proveedoresService.getProveedor(ingreso.proveedor._id).subscribe(({proveedor})=>{
          this.proveedor = proveedor;
          this.loadingInicial = false;
        },({error})=>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          })            
        })
      },({error})=>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
          confirmButtonText: 'Entendido'
        })        
      });
    })
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

  // Seleccionar proveedor
  seleccionarProveedor(proveedorSeleccionado: any): void {
    this.proveedorSeleccionado = true;
    this.proveedor = proveedorSeleccionado
  }

  // Borrar proveedor seleccionado
  borrarProveedorSeleccionado(){
    this.loading = false;
    this.proveedorSeleccionado = false;
    this.proveedores = [];
    this.proveedor = {
      _id: '',
      razon_social: '',
      cuit: '',
      activo: false,
      domicilio: '' 
    };
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
      this.loadingFinal = true;
      const data = {
        numero_remito: `${this.ingresoForm.value.punto_venta}-${this.ingresoForm.value.numero_comprobante}`,
        proveedor: this.proveedor._id,
      };
      this.ingresosService.actualizarIngreso(this.id, data).subscribe(()=>{
        Swal.fire({
          icon: 'success',
          title: 'Completado',
          text: 'Actualizacion correcta',
          timer: 1000,
          showConfirmButton: false  
        });
        this.loadingFinal = false;
        this.router.navigateByUrl(`/dashboard/ingreso_productos/detalles/${this.id}`);
      },({error}) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
          confirmButtonText: 'Entendido'
        })
        this.loadingFinal = false;
      });
    }else{
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Formulario inválido',
        confirmButtonText: 'Entendido'
      });  
    }
  }

}
