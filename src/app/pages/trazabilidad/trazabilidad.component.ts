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
  public loadingBuscar = false;
  
  public productos = [];
  public flagSeleccionado = false;
  public buscando = false;
  public trazabilidad = [];
  public registros: number = 5;

  // Paginación
  public paginacion = {
    limit: this.registros,
    desde: 0,
    hasta: this.registros
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

  constructor(private trazabilidadService: TrazabilidadService,
              private productosService: ProductosService) { }

  ngOnInit(): void {
    this.listarProductos();
  }

  // Listado de resulados
  listarTrazabilidad(): void {
    console.log(this.paginacion);
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
      this.buscando = true;
      this.loadingBuscar = false;
    },({error})=>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.inicio = false;
      this.loading = false;
      this.loadingBuscar = false;
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

  // Ordenar por fecha
  ordenarFecha(): void {
    this.loading = true;
    this.ordenar.direccion === 1 ? this.ordenar.direccion = -1 : this.ordenar.direccion = 1;
    this.listarTrazabilidad();
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
  
    console.log(this.paginacion.desde);
    console.log(this.paginacion.hasta);

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
    this.paginacion.limit = this.registros;
    this.paginacion.desde = 0;
    this.paginacion.hasta = this.registros;  
  } 

  // Buscar
  buscar(parametro: string, registros: number): void {
    this.loading = true;
    this.loadingBuscar = true;
    this.filtroParametro(parametro);
    this.registros = Number(registros);
    this.reiniciarPaginacion(); 
    this.listarTrazabilidad();
  }

  // Filtro por descripcion
  filtroParametro(parametro: string): void {
    this.filtro.parametro = parametro;
  }

  // Filtro por Fecha - Antes
  fechaAntes(fecha: string): void{
    this.fecha.antes = fecha;
  }

  // Fecha por Fecha - Despues
  fechaDespues(fecha: string): void{
    this.fecha.despues = fecha;
  }

}
