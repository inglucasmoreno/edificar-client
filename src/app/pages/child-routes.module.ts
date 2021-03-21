import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { ActualizarPasswordComponent } from './usuarios/editar/actualizar-password.component';
import { ProductosComponent } from './productos/productos.component';
import { NuevoProductoComponent } from './productos/nuevo-producto.component';
import { UnidadMedidaComponent } from './productos/unidad-medida/unidad-medida.component';
import { EditarUnidadComponent } from './productos/unidad-medida/editar-unidad.component';
import { ProductoComponent } from './productos/producto.component';
import { EditarProductoComponent } from './productos/editar/editar-producto/editar-producto.component';
import { IngresoProductosComponent } from './ingreso-productos/ingreso-productos.component';
import { EgresoProductosComponent } from './egreso-productos/egreso-productos.component';

const childRoutes: Routes = [
  { path: 'home' , component: HomeComponent },
  
  // Usuarios
  { path: 'usuarios' , component: UsuariosComponent },
  { path: 'usuarios/nuevo' , component: NuevoUsuarioComponent},
  { path: 'usuarios/editar/:id' , component: EditarUsuarioComponent},
  { path: 'usuarios/password/:id' , component: ActualizarPasswordComponent},
  
  // Productos
  { path: 'productos' , component: ProductosComponent},
  { path: 'productos/nuevo' , component: NuevoProductoComponent},
  { path: 'producto/:id' , component: ProductoComponent},
  { path: 'productos/editar/:id' , component: EditarProductoComponent},

  // Ingreso de productos
  { path: 'ingreso_productos' , component: IngresoProductosComponent},

  // Egreso de productos
  { path: 'egreso_productos' , component: EgresoProductosComponent},

  // Unidades de medida
  { path: 'unidad-medida' , component: UnidadMedidaComponent},
  { path: 'unidad-medida/editar/:id' , component: EditarUnidadComponent},
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule {}