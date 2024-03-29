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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NuevoIngresoComponent } from './ingreso-productos/nuevo-ingreso.component';
import { NuevoEgresoComponent } from './egreso-productos/nuevo-egreso.component';
import { EgresoDetallesComponent } from './egreso-productos/egreso-detalles.component';
import { IngresoDetallesComponent } from './ingreso-productos/ingreso-detalles.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { NuevoProveedorComponent } from './proveedores/nuevo-proveedor.component';
import { EditarProveedorComponent } from './proveedores/editar/editar-proveedor.component';
import { EditarEgresoComponent } from './egreso-productos/editar/editar-egreso.component';
import { EditarIngresoComponent } from './ingreso-productos/editar/editar-ingreso.component';
import { NuevoProductoIngresoComponent } from './ingreso-productos/nuevo-producto-ingreso.component';
import { NuevoProductoEgresoComponent } from './egreso-productos/nuevo-producto-egreso.component';
import { TrazabilidadComponent } from './trazabilidad/trazabilidad.component';
import { PresupuestoComponent } from './presupuesto/presupuesto.component';
import { RemitosEntregaComponent } from './egreso-productos/remitos-entrega/remitos-entrega.component';
import { RemitosDetallesComponent } from './egreso-productos/remitos-entrega/remitos-detalles.component';

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
    NuevoIngresoComponent,
    NuevoEgresoComponent,
    EgresoDetallesComponent,
    IngresoDetallesComponent,
    ProveedoresComponent,
    NuevoProveedorComponent,
    EditarProveedorComponent,
    EditarEgresoComponent,
    EditarIngresoComponent,
    NuevoProductoIngresoComponent,
    NuevoProductoEgresoComponent,
    TrazabilidadComponent,
    PresupuestoComponent,
    RemitosEntregaComponent,
    RemitosDetallesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
