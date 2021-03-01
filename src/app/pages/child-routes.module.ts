import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';

const childRoutes: Routes = [
  { path: 'home' , component: HomeComponent },
  { path: 'usuarios' , component: UsuariosComponent },
  { path: 'usuarios/nuevo' , component: NuevoUsuarioComponent},
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule {}