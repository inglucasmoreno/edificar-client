import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaTablaComponent } from './tarjeta-tabla/tarjeta-tabla.component';
import { PastillaEstadoComponent } from './pastilla-estado/pastilla-estado.component';
import { TarjetaFormularioComponent } from './tarjeta-formulario/tarjeta-formulario.component';
import { IconoTablaComponent } from './icono-tabla/icono-tabla.component';
import { TarjetaMiniFomularioComponent } from './tarjeta-mini-fomulario/tarjeta-mini-fomulario.component';

@NgModule({
  declarations: [
    TarjetaTablaComponent,
    PastillaEstadoComponent,
    TarjetaFormularioComponent,
    IconoTablaComponent,
    TarjetaMiniFomularioComponent
  ],
  imports: [
    CommonModule
  ],exports: [
    TarjetaTablaComponent,
    PastillaEstadoComponent,
    TarjetaFormularioComponent,
    IconoTablaComponent,
    TarjetaMiniFomularioComponent
  ]
})
export class ComponentsModule { }
