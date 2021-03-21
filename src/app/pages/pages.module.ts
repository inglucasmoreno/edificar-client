import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';

import { UsuariosComponent } from './usuarios/usuarios.component';
import { ComponentsModule } from '../components/components.module';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActualizarPasswordComponent } from './usuarios/editar/actualizar-password.component';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { ProductosComponent } from './productos/productos.component';
import { UnidadMedidaComponent } from './productos/unidad-medida/unidad-medida.component';
import { NuevoProductoComponent } from './productos/nuevo-producto.component';
import { EditarUnidadComponent } from './productos/unidad-medida/editar-unidad.component';
import { ProductoComponent } from './productos/producto.component';
import { EditarProductoComponent } from './productos/editar/editar-producto/editar-producto.component';
import { IngresoProductosComponent } from './ingreso-productos/ingreso-productos.component';
import { EgresoProductosComponent } from './egreso-productos/egreso-productos.component';

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    UsuariosComponent,
    NuevoUsuarioComponent,
    ActualizarPasswordComponent,
    EditarUsuarioComponent,
    ProductosComponent,
    UnidadMedidaComponent,
    NuevoProductoComponent,
    EditarUnidadComponent,
    ProductoComponent,
    EditarProductoComponent,
    IngresoProductosComponent,
    EgresoProductosComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
