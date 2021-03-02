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

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    UsuariosComponent,
    NuevoUsuarioComponent,
    ActualizarPasswordComponent,
    EditarUsuarioComponent,
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
