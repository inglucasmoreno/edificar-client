import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Egreso } from 'src/app/models/egreso.model';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
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
  public egreso: Egreso;
  

  public egresoForm = this.fb.group({
    descripcion_cliente: ['', Validators.required],
    tipo_identificacion_cliente: ['DNI', Validators.required],
    identificacion_cliente: ['', Validators.required],
  });

  constructor(private fb: FormBuilder,
              private alertService: AlertService,
              private dataService: DataService,
              private activatedRouter: ActivatedRoute,
              private egresoService: EgresoService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Egresos - Editando';
    this.activatedRouter.params.subscribe(({id})=>{
      this.id = id;
      this.alertService.loading();
      this.egresoService.getEgreso(id).subscribe(({egreso})=>{
        this.egreso = egreso;
        this.egresoForm.setValue({
          descripcion_cliente: egreso.descripcion_cliente,
          tipo_identificacion_cliente: egreso.tipo_identificacion_cliente,
          identificacion_cliente: egreso.identificacion_cliente
        });  
        this.alertService.close();
      },({error})=>{
        this.alertService.errorApi(error.msg);
      })
    })  
  }

  // Actualizando egreso
  actualizarEgreso(): void {

    const { descripcion_cliente, tipo_identificacion_cliente, identificacion_cliente } = this.egresoForm.value;

    const formularioValido = this.egresoForm.valid && descripcion_cliente.trim() !== '' && tipo_identificacion_cliente.trim() !== '' && identificacion_cliente.trim() !== '';

    if(formularioValido){
      this.alertService.loading();
      this.egresoService.actualizarEgreso(this.id, this.egresoForm.value).subscribe(()=>{
        this.alertService.close();
        this.router.navigateByUrl(`/dashboard/egreso_productos/detalles/${this.id}`);
      },({error})=>{
        this.alertService.errorApi(error.msg);
      });
    }else{
      this.alertService.formularioInvalido();
    }   
  }

}
