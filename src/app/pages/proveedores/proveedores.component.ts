import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/models/proveedor.model';
import Swal from 'sweetalert2';
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styles: [
  ]
})
export class ProveedoresComponent implements OnInit {

  public total = 0;
  public proveedores: Proveedor[] = [];
  public loading = true;

  // Paginación
  public paginacion = {
    limit: 10,
    desde: 0,
    hasta: 10
  };

  // Filtrado
  public filtro = {
    descripcion: '',
    activo: true
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'razon_social'
  }

  constructor(private proveedoresService: ProveedoresService) { }

  ngOnInit(): void {
    this.listarProveedores();
  }

  // Listar Proveedores
  listarProveedores(): void {
    this.proveedoresService.listarProveedores(
      this.paginacion.limit,
      this.paginacion.desde,
      this.filtro.activo,
      this.filtro.descripcion,
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe(({proveedores, total}) => {
      this.proveedores = proveedores;
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

  // Actualizar estado
  actualizarEstado(proveedor: Proveedor): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se esta por actualizar un estado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.proveedoresService.actualizarProveedor(proveedor._id, { activo: !proveedor.activo }).subscribe( () => {
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'Estado actualizado',
            timer: 1000,
            showConfirmButton: false
          });
          this.listarProveedores();          
        },(({ error }) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
          this.loading = false;
        }));
      }
    })  
  }

  // Filtrar Activo/Inactivo
   filtrarActivos(activo: any): void{
    this.loading = true;
    this.filtro.activo = activo;
    this.listarProveedores();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.loading = true;
    this.filtro.descripcion= descripcion;
    this.listarProveedores();
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
  
    this.listarProveedores();

  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.loading = true;
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarProveedores();
  }


}
