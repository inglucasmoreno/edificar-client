import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UnidadMedidaService } from '../../../services/unidad-medida.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-unidad',
  templateUrl: './editar-unidad.component.html',
  styles: [
  ]
})
export class EditarUnidadComponent implements OnInit {

  public id = '';
  public loading = true;

  public formUnidad = this.fb.group({
    descripcion: ['', Validators.required],
    activo: [true, Validators.required]
  });

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private unidadMedidaService: UnidadMedidaService,
              private router: Router 
            ) { }
          
  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.id = id;
      this.getUnidad(id);
    });
  }

  getUnidad(id: string): void {
    this.unidadMedidaService.getUnidad(id).subscribe( ({ unidad }) => {
      this.formUnidad.setValue({
        descripcion: unidad.descripcion,
        activo: unidad.activo
      });
      this.loading = false;
    },(({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loading = false;
    }))    
  }
  
  actualizarUnidad(): void {
    const { descripcion } = this.formUnidad.value;
    if(this.formUnidad.status === 'INVALID' || descripcion.trim() === ''){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe completar todos los campos',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    this.loading = true;
    this.unidadMedidaService.actualizarUnidad(this.id, this.formUnidad.value).subscribe( () => {
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'Unidad actualizada correctamente',
        timer: 1000,
        showConfirmButton: false
      });  
      this.loading = false;
      this.router.navigateByUrl('dashboard/unidad-medida');
    },(({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })
      this.loading = false;  
    }));
  }

}
