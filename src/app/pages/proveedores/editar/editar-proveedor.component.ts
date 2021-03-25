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

  public loading = true;
  public proveedor: Proveedor;

  public proveedorForm = this.fb.group({
    razon_social: ['', Validators.required],
    cuit: ['', Validators.required],
    domicilio: '',
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

  getProveedor(id: string): void {
    this.proveedoresService.getProveedor(id).subscribe(({proveedor})=>{
      this.proveedor = proveedor;
      this.proveedorForm.setValue({
        razon_social: proveedor.razon_social,
        cuit: proveedor.cuit,
        domicilio: proveedor.domicilio,
        activo: proveedor.activo
      });
      this.loading = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loading = false;  
    });
  }

  actualizarProveedor(): void {
    if(this.proveedorForm.valid){
      this.loading = true;
      this.proveedoresService.actualizarProveedor(this.proveedor._id, this.proveedorForm.value).subscribe(()=>{
        Swal.fire({
          icon: 'success',
          title: 'Completado',
          text: 'Actualizado correctamente',
          timer: 1000,
          showConfirmButton: false
        });
        this.router.navigateByUrl('/dashboard/proveedores');
        this.loading = false;  
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
