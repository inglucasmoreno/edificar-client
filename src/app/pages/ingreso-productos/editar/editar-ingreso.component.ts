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
    numero_remito: ['', Validators.required],
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
        this.ingresoForm.setValue({
          numero_remito: ingreso.numero_remito
        });
        this.proveedoresService.getProveedor(ingreso.proveedor).subscribe(({proveedor})=>{
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

  actualizarIngreso(): void {
    if(this.ingresoForm.valid && this.proveedorSeleccionado){
      this.loadingFinal = true;
      const data = {
        numero_remito: this.ingresoForm.value.numero_remito,
        proveedor: this.proveedor._id,
        razon_social_proveedor: this.proveedor.razon_social,
        cuit_proveedor: this.proveedor.cuit
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
