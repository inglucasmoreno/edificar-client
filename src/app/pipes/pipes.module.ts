import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { RolPipe } from './rol.pipe';
import { AlertaStockPipe } from './alerta-stock.pipe';



@NgModule({
  declarations: [
    FechaPipe,
    RolPipe,
    AlertaStockPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    RolPipe,
    AlertaStockPipe
  ]
})
export class PipesModule { }
