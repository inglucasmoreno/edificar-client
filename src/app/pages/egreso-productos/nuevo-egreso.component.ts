import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EgresoService } from '../../services/egreso.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-egreso',
  templateUrl: './nuevo-egreso.component.html',
  styles: [
  ]
})
export class NuevoEgresoComponent implements OnInit {

  public loading = false;

  constructor(private fb: FormBuilder,
              private egresoService: EgresoService,
              private router: Router) { }
  
  public egresoForm = this.fb.group({
    descripcion_cliente: ['', Validators.required],
    tipo_identificacion_cliente: ['DNI', Validators.required],
    identificacion_cliente: ['', Validators.required],
  });

  ngOnInit(): void {
  }

  crearEgreso(): void {
    if(this.egresoForm.valid){
      this.loading = true;
      this.egresoService.nuevoEgreso(this.egresoForm.value).subscribe(({egreso})=>{
        Swal.fire({
          icon: 'success',
          title: 'Completado',
          text: 'Nuevo egreso creado correctamente',
          showConfirmButton: false,
          timer: 1000
        });
        this.loading = false;
        this.router.navigateByUrl(`/dashboard/egreso_productos/detalles/${egreso._id}`);
      },({error})=>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
          confirmButtonText: 'Entendido'
        }),
        this.loading = false;  
      });
    }else{
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debe completar todos los campos',
        confirmButtonText: 'Entendido'
      });
    }  
  }


}
