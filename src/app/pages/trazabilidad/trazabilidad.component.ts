import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TrazabilidadService } from '../../services/trazabilidad.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-trazabilidad',
  templateUrl: './trazabilidad.component.html',
  styles: [
  ]
})
export class TrazabilidadComponent implements OnInit {

  public total = 0;
  public inicio = true;
  public loading = false;
  public productos = [];

  // Paginación
  public paginacion = {
    limit: 5,
    desde: 0,
    hasta: 5
  };

  // Filtrado
  public filtro = {
    tipo: '',  
    producto: '',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  // Fechas
  public fecha = {
    antes: '',
    despues: ''
  }

  public trazabilidad = [];

  constructor(private trazabilidadService: TrazabilidadService,
              private productosService: ProductosService) { }

  ngOnInit(): void {
    this.listarProductos();
  }

  listarTrazabilidad(): void {
    this.inicio = false;
    this.trazabilidadService.listarTrazabilidad(
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.tipo,
      this.filtro.producto,
      this.filtro.parametro,
      this.ordenar.direccion,
      this.ordenar.columna,
      this.fecha.antes,
      this.fecha.despues
    ).subscribe( ({ trazabilidad, total }) => {
      this.trazabilidad = trazabilidad;
      this.total = total;
      this.loading = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loading = false;
    });  
  }

  listarProductos(): void {
    this.productosService.listarProductos().subscribe(({productos}) => {
      this.productos = productos      
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loading = false;
    });
  }

  // Filtrar por tipo
  filtrarTipos(tipo: string): void{
    this.filtro.tipo = tipo;
  }

  // Filtrar por producto
  filtrarProducto(producto: string): void{
    this.filtro.producto = producto;
  }

  // Filtrar por Cliente o Proveedor
  filtrarParametro(parametro: string): void{
    this.filtro.parametro = parametro;
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
    this.listarTrazabilidad();
  }
  
  // Se reestablecen los valores de paginacion
  reiniciarPaginacion(): void {
    this.paginacion.limit = 5;
    this.paginacion.desde = 0;
    this.paginacion.hasta = 5;  
  } 

  // Buscar
  buscar(): void {
    this.loading = true;
    this.reiniciarPaginacion(); 
    this.listarTrazabilidad();
  }

  // Fecha antes
  fechaAntes(fecha: string): void{
    this.fecha.antes = fecha;
  }

  // Fecha despues
  fechaDespues(fecha: string): void{
    this.fecha.despues = fecha;
  }

}
