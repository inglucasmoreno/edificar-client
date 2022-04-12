import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaTablaComponent } from './tarjeta-tabla/tarjeta-tabla.component';
import { PastillaEstadoComponent } from './pastilla-estado/pastilla-estado.component';
import { TarjetaFormularioComponent } from './tarjeta-formulario/tarjeta-formulario.component';
import { IconoTablaComponent } from './icono-tabla/icono-tabla.component';
import { TarjetaMiniFomularioComponent } from './tarjeta-mini-fomulario/tarjeta-mini-fomulario.component';
import { PastillaEtapaComponent } from './pastilla-etapa/pastilla-etapa.component';
import { ModalComponent } from './modal/modal.component';
import { ModalMediumComponent } from './modal-medium/modal-medium.component';
import { ModalSmallComponent } from './modal-small/modal-small.component';
import { TarjetaListaComponent } from './tarjeta-lista/tarjeta-lista.component';
import { TarjetaMiniComponent } from './tarjeta-mini/tarjeta-mini.component';

@NgModule({
  declarations: [
    TarjetaTablaComponent,
    PastillaEstadoComponent,
    TarjetaFormularioComponent,
    IconoTablaComponent,
    TarjetaMiniFomularioComponent,
    PastillaEtapaComponent,
    ModalComponent,
    ModalMediumComponent,
    ModalSmallComponent,
    TarjetaListaComponent,
    TarjetaMiniComponent
  ],
  imports: [
    CommonModule
  ],exports: [
    ModalComponent,
    ModalSmallComponent,
    TarjetaTablaComponent,
    TarjetaListaComponent,
    TarjetaMiniComponent,
    PastillaEstadoComponent,
    TarjetaFormularioComponent,
    IconoTablaComponent,
    TarjetaMiniFomularioComponent,
    PastillaEtapaComponent
  ]
})
export class ComponentsModule { }
