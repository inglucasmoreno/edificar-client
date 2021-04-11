import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
  selector: 'app-nuevo-proveedor',
  templateUrl: './nuevo-proveedor.component.html',
  styles: [
  ]
})
export class NuevoProveedorComponent implements OnInit {

  public loading = false;

  public proveedorForm = this.fb.group({
    razon_social: ['', Validators.required],
    cuit: ['', Validators.required],
    domicilio: '',
    condicion_iva: 'IVA Responsable Inscripto',
    activo: true
  });

  constructor(private fb: FormBuilder,
              private proveedorService: ProveedoresService,
              private router: Router) { }

  ngOnInit(): void {}
  
  // Se crea el proveedor
  crearProveedor(): void {
    
    const {razon_social, cuit, domicilio, condicion_iva, activo} = this.proveedorForm.value;
    
    const formularioValido = razon_social.trim() !== '' &&
                             cuit.trim() !== '' &&
                             this.proveedorForm.valid
                            
    if(formularioValido){
      let data = {
        razon_social,
        cuit,
        condicion_iva,
        activo
      }
      if(domicilio.trim() != '') data['domicilio'] = domicilio;
      this.loading = true;
      this.proveedorService.nuevoProveedor(data).subscribe(()=>{
        Swal.fire({
          icon: 'success',
          title: 'Completado',
          text: 'Proveedor creado correctamente',
          timer: 1000,
          showConfirmButton: false
        })            
        this.loading = false;
        this.router.navigateByUrl('/dashboard/proveedores');
      },({error})=>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
          confirmButtonText: 'Entendido'
        });
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
