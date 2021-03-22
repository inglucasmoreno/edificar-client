import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Ingreso } from '../../models/ingreso.model';
import { IngresosService } from '../../services/ingresos.service';

@Component({
  selector: 'app-ingreso-productos',
  templateUrl: './ingreso-productos.component.html',
  styles: [
  ]
})
export class IngresoProductosComponent implements OnInit {

  public total = 0;
  public loading = true;
  public ingresos: Ingreso[] = [];

  // Paginación
  public paginacion = {
    limit: 10,
    desde: 0,
    hasta: 10
  };

  // Filtrado
  public filtro = {
    descripcion: '',
    estado: 'En proceso'
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }
  constructor(private ingresosService: IngresosService) { }

  ngOnInit(): void {
    this.listarIngresos();
  }

  listarIngresos(): void {
    this.ingresosService.listarIngresos(
      this.paginacion.limit,
      this.paginacion.desde,
      this.filtro.estado,
      this.filtro.descripcion,
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe( ({ ingresos, total }) => {
      this.ingresos = ingresos;
      this.total = total;
      this.loading = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })  
    });
  }

  // Filtro por Estado
   filtrarActivos(estado: string): void{
    this.loading = true;
    this.filtro.estado = estado;
    this.listarIngresos();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.loading = true;
    this.filtro.descripcion= descripcion;
    this.listarIngresos();
  }

  // Funcion de paginación
  actualizarDesdeHasta(selector): void {
    this.loading = true;
  
    if (selector === 'siguiente'){ // Incrementar
      if (this.paginacion.hasta < this.total){
        this.paginacion.desde += this.paginacion.limit;
        this.paginacion.hasta += this.paginacion.limit;
      }
    }else{                         // Decrementar
      this.paginacion.desde -= this.paginacion.limit;
      if (this.paginacion.desde < 0){
        this.paginacion.desde = 0;
      }else{
        this.paginacion.hasta -= this.paginacion.limit;
      }
    }
  
    this.listarIngresos();

  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.loading = true;
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarIngresos();
  }

}
