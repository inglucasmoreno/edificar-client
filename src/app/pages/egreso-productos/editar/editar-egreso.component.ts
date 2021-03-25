import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Egreso } from 'src/app/models/egreso.model';
import Swal from 'sweetalert2';
import { EgresoService } from '../../../services/egreso.service';

@Component({
  selector: 'app-editar-egreso',
  templateUrl: './editar-egreso.component.html',
  styles: [
  ]
})
export class EditarEgresoComponent implements OnInit {
  
  public id: string;
  public loading = true;
  public loadingFinal = false;
  public egreso: Egreso;
  

  public egresoForm = this.fb.group({
    descripcion_cliente: ['', Validators.required],
    tipo_identificacion_cliente: ['DNI', Validators.required],
    identificacion_cliente: ['', Validators.required],
  });

  constructor(private fb: FormBuilder,
              private activatedRouter: ActivatedRoute,
              private egresoService: EgresoService,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(({id})=>{
      this.id = id;
      this.egresoService.getEgreso(id).subscribe(({egreso})=>{
        this.egreso = egreso;
        this.egresoForm.setValue({
          descripcion_cliente: egreso.descripcion_cliente,
          tipo_identificacion_cliente: egreso.tipo_identificacion_cliente,
          identificacion_cliente: egreso.identificacion_cliente
        });  
        this.loading = false;
      },({error})=>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
          confirmButtonText: 'Entendido'
        })        
      })
    })  
  }

  actualizarEgreso(): void {
    if(this.egresoForm.valid){
      this.loadingFinal = true;
      this.egresoService.actualizarEgreso(this.id, this.egresoForm.value).subscribe(()=>{
        Swal.fire({
          icon: 'success',
          title: 'Completado',
          text: 'Actualizacion completada',
          timer: 1000,
          showConfirmButton: false
        });
        this.loadingFinal = false;
        this.router.navigateByUrl(`/dashboard/egreso_productos/detalles/${this.id}`);
      },({error})=>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
          confirmButtonText: 'Entendido'
        })  
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
