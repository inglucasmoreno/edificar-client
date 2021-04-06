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
import { NuevoIngresoComponent } from './ingreso-productos/nuevo-ingreso.component';
import { NuevoEgresoComponent } from './egreso-productos/nuevo-egreso.component';
import { IngresoDetallesComponent } from './ingreso-productos/ingreso-detalles.component';
import { EgresoDetallesComponent } from './egreso-productos/egreso-detalles.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { NuevoProveedorComponent } from './proveedores/nuevo-proveedor.component';
import { EditarProveedorComponent } from './proveedores/editar/editar-proveedor.component';
import { EditarIngresoComponent } from './ingreso-productos/editar/editar-ingreso.component';
import { EditarEgresoComponent } from './egreso-productos/editar/editar-egreso.component';
import { NuevoProductoIngresoComponent } from './ingreso-productos/nuevo-producto-ingreso.component';
import { NuevoProductoEgresoComponent } from './egreso-productos/nuevo-producto-egreso.component';
import { TrazabilidadComponent } from './trazabilidad/trazabilidad.component';
import { PresupuestoComponent } from './presupuesto/presupuesto.component';

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
  { path: 'ingreso_productos/nuevo' , component: NuevoIngresoComponent},
  { path: 'ingreso_productos/detalles/:id' , component: IngresoDetallesComponent},
  { path: 'ingreso_productos/editar/:id' , component: EditarIngresoComponent},
  { path: 'ingreso_productos/nuevo-producto/:id' , component: NuevoProductoIngresoComponent},

  // Egreso de productos
  { path: 'egreso_productos' , component: EgresoProductosComponent},
  { path: 'egreso_productos/nuevo' , component: NuevoEgresoComponent},
  { path: 'egreso_productos/detalles/:id' , component: EgresoDetallesComponent},
  { path: 'egreso_productos/editar/:id' , component: EditarEgresoComponent},
  { path: 'egreso_productos/nuevo-producto/:id' , component: NuevoProductoEgresoComponent},

  // Unidades de medida
  { path: 'unidad-medida' , component: UnidadMedidaComponent},
  { path: 'unidad-medida/editar/:id' , component: EditarUnidadComponent},

  // Proveedores
  { path: 'proveedores' , component: ProveedoresComponent},
  { path: 'proveedores/nuevo' , component: NuevoProveedorComponent},
  { path: 'proveedores/editar/:id' , component: EditarProveedorComponent},

  // Trazabilidad
  { path: 'trazabilidad' , component: TrazabilidadComponent},

  // Presupuesto
  { path: 'presupuesto' , component: PresupuestoComponent},

]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule {}