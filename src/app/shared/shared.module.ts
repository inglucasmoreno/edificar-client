import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
import { StatebarComponent } from './statebar/statebar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LoaderComponent,
    StatebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    LoaderComponent,
    StatebarComponent
  ]
})
export class SharedModule { }
