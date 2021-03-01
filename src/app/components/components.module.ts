import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaTablaComponent } from './tarjeta-tabla/tarjeta-tabla.component';
import { PastillaEstadoComponent } from './pastilla-estado/pastilla-estado.component';
import { TarjetaFormularioComponent } from './tarjeta-formulario/tarjeta-formulario.component';

@NgModule({
  declarations: [
    TarjetaTablaComponent,
    PastillaEstadoComponent,
    TarjetaFormularioComponent
  ],
  imports: [
    CommonModule
  ],exports: [
    TarjetaTablaComponent,
    PastillaEstadoComponent,
    TarjetaFormularioComponent
  ]
})
export class ComponentsModule { }
