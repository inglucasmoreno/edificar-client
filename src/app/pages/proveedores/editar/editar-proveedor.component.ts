import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Proveedor } from 'src/app/models/proveedor.model';
import Swal from 'sweetalert2';
import { ProveedoresService } from '../../../services/proveedores.service';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styles: [
  ]
})
export class EditarProveedorComponent implements OnInit {

  public loadingInicio = true;
  public loadingActualizando = false;
  public proveedor: Proveedor;

  public proveedorForm = this.fb.group({
    razon_social: ['', Validators.required],
    cuit: ['', Validators.required],
    domicilio: '',
    condicion_iva: '',
    activo: true
  });

  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private proveedoresService: ProveedoresService,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.getProveedor(id);
    })
  }
  
  // Se traen los datos del proveedor
  getProveedor(id: string): void {
    this.proveedoresService.getProveedor(id).subscribe(({proveedor})=>{
      this.proveedor = proveedor;
      this.proveedorForm.setValue({
        razon_social: proveedor.razon_social,
        cuit: proveedor.cuit,
        domicilio: proveedor.domicilio,
        condicion_iva: proveedor.condicion_iva,
        activo: proveedor.activo
      });
      this.loadingInicio = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingInicio = false;  
    });
  }

  // Actualizando proveedor
  actualizarProveedor(): void {

    const {razon_social, cuit} = this.proveedorForm.value;
    
    const formularioValido = razon_social.trim() !== '' &&
                             cuit.trim() !== '' &&
                             this.proveedorForm.valid

    if(formularioValido){
      this.loadingActualizando = true;
      this.proveedoresService.actualizarProveedor(this.proveedor._id, this.proveedorForm.value).subscribe(()=>{
        Swal.fire({
          icon: 'success',
          title: 'Completado',
          text: 'Actualizado correctamente',
          timer: 1000,
          showConfirmButton: false
        });
        this.router.navigateByUrl('/dashboard/proveedores');
        this.loadingActualizando = false;  
      },({error})=>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
          confirmButtonText: 'Entendido'  
        });
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
