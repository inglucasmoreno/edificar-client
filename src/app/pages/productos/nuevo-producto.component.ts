import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styles: [
  ]
})
export class NuevoProductoComponent implements OnInit {

  public loading = false;

  public productoForm = this.fb.group({
    codigo: ['LB0001', Validators.required],
    descripcion: ['', Validators.required],
    unidad_medida: ['', Validators.required],
    cantidad: [0, Validators.required],
    stock_minimo: [false, Validators.required],
    cantidad_minima: [0, Validators.required],
    precio: [0, Validators.required],
    activo: [true, Validators.required]
  });
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }
  
  crearProducto(): void {
    console.log(this.productoForm);
    if(this.productoForm.valid){
      console.log(this.productoForm.value);
    }else{
      console.log('Formulario no valida')
    }
  }

}
