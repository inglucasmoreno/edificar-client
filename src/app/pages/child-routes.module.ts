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

const childRoutes: Routes = [
  { path: 'home' , component: HomeComponent },
  { path: 'usuarios' , component: UsuariosComponent },
  { path: 'usuarios/nuevo' , component: NuevoUsuarioComponent},
  { path: 'usuarios/editar/:id' , component: EditarUsuarioComponent},
  { path: 'usuarios/password/:id' , component: ActualizarPasswordComponent},
  { path: 'productos' , component: ProductosComponent},
  { path: 'productos/nuevo' , component: NuevoProductoComponent},
  { path: 'producto/:id' , component: ProductoComponent},
  { path: 'unidad-medida' , component: UnidadMedidaComponent},
  { path: 'unidad-medida/editar/:id' , component: EditarUnidadComponent},
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule {}