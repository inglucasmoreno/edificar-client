import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EgresoService } from '../../services/egreso.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-nuevo-egreso',
  templateUrl: './nuevo-egreso.component.html',
  styles: [
  ]
})
export class NuevoEgresoComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private alertService: AlertService,
              private dataService: DataService,
              private egresoService: EgresoService,
              private router: Router) { }
  
  public egresoForm = this.fb.group({
    descripcion_cliente: ['', Validators.required],
    tipo_identificacion_cliente: ['DNI', Validators.required],
    identificacion_cliente: ['', Validators.required],
  });

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Egresos - Creando';
  }

  // Nuevo egreso
  crearEgreso(): void {

    const { descripcion_cliente, tipo_identificacion_cliente, identificacion_cliente } = this.egresoForm.value;
    const formularioValido = this.egresoForm.valid && descripcion_cliente.trim() !== '' && tipo_identificacion_cliente.trim() !== '' && identificacion_cliente.trim() !== '';
   
    if(formularioValido){
      this.alertService.loading();
      this.egresoService.nuevoEgreso(this.egresoForm.value).subscribe(({egreso})=>{
        this.alertService.close();
        this.router.navigateByUrl(`/dashboard/egreso_productos/detalles/${egreso._id}`);
      },({error})=>{
        this.alertService.errorApi(error.msg);
      });
    }else{
      this.alertService.formularioInvalido();
    }  
  }


}
