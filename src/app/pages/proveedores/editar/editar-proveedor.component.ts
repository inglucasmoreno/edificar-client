import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Proveedor } from 'src/app/models/proveedor.model';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { ProveedoresService } from '../../../services/proveedores.service';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styles: [
  ]
})
export class EditarProveedorComponent implements OnInit {

  public proveedor: Proveedor;

  public proveedorForm = this.fb.group({
    razon_social: ['', Validators.required],
    cuit: ['', Validators.required],
    domicilio: '',
    condicion_iva: '',
    activo: true
  });

  constructor(private activatedRoute: ActivatedRoute,
              private alertService: AlertService,
              private dataService: DataService,
              private fb: FormBuilder,
              private proveedoresService: ProveedoresService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - ";
    this.activatedRoute.params.subscribe(({ id }) => {
      this.getProveedor(id);
    })
  }
  
  // Se traen los datos del proveedor
  getProveedor(id: string): void {
    this.alertService.loading();
    this.proveedoresService.getProveedor(id).subscribe(({proveedor})=>{
      this.proveedor = proveedor;
      this.proveedorForm.setValue({
        razon_social: proveedor.razon_social,
        cuit: proveedor.cuit,
        domicilio: proveedor.domicilio,
        condicion_iva: proveedor.condicion_iva,
        activo: proveedor.activo
      });
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Actualizando proveedor
  actualizarProveedor(): void {

    const {razon_social, cuit} = this.proveedorForm.value;
    
    const formularioValido = razon_social.trim() !== '' &&
                             cuit.trim() !== '' &&
                             this.proveedorForm.valid

    if(formularioValido){
      this.alertService.loading();
      this.proveedoresService.actualizarProveedor(this.proveedor._id, this.proveedorForm.value).subscribe(()=>{
        this.alertService.close();
        this.router.navigateByUrl('/dashboard/proveedores');
      },({error})=>{
        this.alertService.errorApi(error.msg);
      });  
    }else{
      this.alertService.formularioInvalido();
    }
  }

}
