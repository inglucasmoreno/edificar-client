import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard';

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
import { AdminGuard } from '../guards/admin.guard';
import { RemitosEntregaComponent } from './egreso-productos/remitos-entrega/remitos-entrega.component';
import { RemitosDetallesComponent } from './egreso-productos/remitos-entrega/remitos-detalles.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home' , component: HomeComponent },
  
      // Usuarios
      { path: 'usuarios',canActivate: [ AdminGuard ] , component: UsuariosComponent },
      { path: 'usuarios/nuevo', canActivate: [ AdminGuard ] , component: NuevoUsuarioComponent},
      { path: 'usuarios/editar/:id', canActivate: [ AdminGuard ], component: EditarUsuarioComponent},
      { path: 'usuarios/password/:id' , canActivate: [ AdminGuard ], component: ActualizarPasswordComponent},
      
      // Productos
      { path: 'productos' , component: ProductosComponent},
      { path: 'productos/nuevo', canActivate: [ AdminGuard ] , component: NuevoProductoComponent},
      { path: 'producto/:id', canActivate: [ AdminGuard ] , component: ProductoComponent},
      { path: 'productos/editar/:id', canActivate: [ AdminGuard ] , component: EditarProductoComponent},
    
      // Ingreso de productos
      { path: 'ingreso_productos', canActivate: [ AdminGuard ], component: IngresoProductosComponent},
      { path: 'ingreso_productos/nuevo', canActivate: [ AdminGuard ], component: NuevoIngresoComponent},
      { path: 'ingreso_productos/detalles/:id', canActivate: [ AdminGuard ], component: IngresoDetallesComponent},
      { path: 'ingreso_productos/editar/:id', canActivate: [ AdminGuard ], component: EditarIngresoComponent},
      { path: 'ingreso_productos/nuevo-producto/:id', canActivate: [ AdminGuard ], component: NuevoProductoIngresoComponent},
    
      // Egreso de productos
      { path: 'egreso_productos', canActivate: [ AdminGuard ], component: EgresoProductosComponent},
      { path: 'egreso_productos/nuevo', canActivate: [ AdminGuard ], component: NuevoEgresoComponent},
      { path: 'egreso_productos/detalles/:id', canActivate: [ AdminGuard ], component: EgresoDetallesComponent},
      { path: 'egreso_productos/editar/:id', canActivate: [ AdminGuard ], component: EditarEgresoComponent},
      { path: 'egreso_productos/nuevo-producto/:id', canActivate: [ AdminGuard ] , component: NuevoProductoEgresoComponent},

      { path: 'egreso_productos/remitos-entrega/:id', canActivate: [ AdminGuard ] , component: RemitosEntregaComponent},
      { path: 'egreso_productos/remitos-detalles/:id', canActivate: [ AdminGuard ] , component: RemitosDetallesComponent},

      // Unidades de medida
      { path: 'unidad-medida', canActivate: [ AdminGuard ], component: UnidadMedidaComponent},
      { path: 'unidad-medida/editar/:id', canActivate: [ AdminGuard ], component: EditarUnidadComponent},
    
      // Proveedores
      { path: 'proveedores', canActivate: [ AdminGuard ], component: ProveedoresComponent},
      { path: 'proveedores/nuevo', canActivate: [ AdminGuard ], component: NuevoProveedorComponent},
      { path: 'proveedores/editar/:id', canActivate: [ AdminGuard ], component: EditarProveedorComponent},
    
      // Trazabilidad
      { path: 'trazabilidad', canActivate: [ AdminGuard ], component: TrazabilidadComponent},
    
      // Presupuesto
      { path: 'presupuesto', component: PresupuestoComponent},
    ]  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }