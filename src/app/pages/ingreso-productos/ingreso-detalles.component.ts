import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngresosService } from '../../services/ingresos.service';
import Swal from 'sweetalert2';
import { IngresoProductosService } from '../../services/ingreso-productos.service';
import { DataService } from 'src/app/services/data.service';
import { AlertService } from 'src/app/services/alert.service';
import gsap from 'gsap';


@Component({
  selector: 'app-ingreso-detalles',
  templateUrl: './ingreso-detalles.component.html',
  styles: [
  ]
})
export class IngresoDetallesComponent implements OnInit {

  public id;

  // Totales
  public total;
  public totalGeneral;
  
  // Ingreso
  public ingreso = {
    numero_remito: '',
    proveedor: '',
  };

  // Filtrado
  public filtro = {
    activo: ''
  }
  
  // Paginacion
  public paginacion = {
    limit: 5,
    desde: 0,
    hasta: 5
  }

  public productos = [];                  // Productos del ingreso

  constructor(private ingresoService: IngresosService,
              private dataService: DataService,
              private alertService: AlertService,
              private activatedRoute: ActivatedRoute,
              private ingresoProductosService: IngresoProductosService,
              private router: Router) { }

  ngOnInit(): void {
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
    this.dataService.ubicacionActual = "Dashboard - Ingresos - Detalles";
    this.activatedRoute.params.subscribe(({ id }) => {  
      this.id = id;
      this.alertService.loading();
      this.ingresoService.getIngreso(id).subscribe( ({ ingreso }) => {
       this.ingreso = ingreso;
       this.primerIngreso();
      });  
    },({error}) => {
      this.alertService.errorApi(error.msg);
    });
  }
  
  // Primer ingreso a la pagina
  primerIngreso(): void {
    this.ingresoProductosService.listarProductosPorIngreso(
      this.id,
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.activo
      ).subscribe( ({ productos, total, totalGeneral }) => {
      this.totalGeneral = totalGeneral;
      this.productos = productos;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });  
  }

  // Completar ingreso
  completarIngreso(): void {
    
    // Se verifica si el remito tiene productos
    if(this.totalGeneral <= 0){
      this.alertService.info('El ingreso no tiene productos');
      return;
    }

    this.alertService.question({ msg: 'Está por completar el ingreso', buttonText: 'Completar' })
      .then(({isConfirmed}) => {  
        if (isConfirmed) {
          this.alertService.loading();

          const data = {
            persona_empresa: this.ingreso.proveedor['razon_social'],
            documento_codigo: this.ingreso.numero_remito
          }
          this.ingresoProductosService.completarIngreso(this.id, data).subscribe(() => {
            Swal.fire({
              icon: 'success',
              title: 'Completado',
              text: 'Ingreso completado correctamente',
              timer: 1000,
              showConfirmButton: false
            });
            this.alertService.close();
            this.router.navigateByUrl('/dashboard/ingreso_productos'); 
          },({error})=>{
            this.alertService.errorApi(error.msg);
          });
        }
      }); 
  }

  // Listar productos por ingreso
  listarProductosPorIngreso(): void {
    this.alertService.loading();
    this.ingresoProductosService.listarProductosPorIngreso(
      this.id,
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.activo
      ).subscribe( ({ productos, total, totalGeneral }) => {
      this.totalGeneral = totalGeneral;
      this.productos = productos;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }
  
  // Eliminar producto
  eliminarProducto(producto: string): void {
    this.alertService.question({ msg: 'Está por eliminar un producto', buttonText: 'Eliminar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        this.alertService.loading();
        this.ingresoProductosService.eliminarProducto(producto).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'El producto fue eliminado',
            timer: 1000,
            showConfirmButton: false
          });
          this.listarProductosPorIngreso();  
        },({error})=>{
          this.alertService.errorApi(error.msg);
        });
      }
    }); 
  }

  // Ingreso parcial de producto
  ingresoParcial(producto: string): void {
    this.alertService.question({ msg: 'Está por ingresar un producto', buttonText: 'Ingresar' })
      .then(({isConfirmed}) => {  
        if (isConfirmed) {
          this.alertService.loading();
          const data = {
            persona_empresa: this.ingreso.proveedor['razon_social'],
            documento_codigo: this.ingreso.numero_remito
          }
          this.ingresoProductosService.ingresoParcial(producto, data).subscribe(() => {
            Swal.fire({
              icon: 'success',
              title: 'Completado',
              text: 'El producto fue ingresado',
              timer: 1000,
              showConfirmButton: false
            });
            this.listarProductosPorIngreso();  
          },({error})=>{
            this.alertService.errorApi(error.msg);
          });
        }
      }); 
  }

  // Filtro por activo
  filtrarActivo(activo: any): void{
    this.alertService.loading();
    this.filtro.activo = activo;
    this.reiniciarPaginacion();
    this.listarProductosPorIngreso();
  }

  // Funcion de paginación
  actualizarDesdeHasta(selector): void {
    this.alertService.loading();
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
    this.listarProductosPorIngreso();
  }
  
  // Se reestablecen los valores de paginacion
  reiniciarPaginacion(): void {
    this.paginacion.limit = 5;
    this.paginacion.desde = 0;
    this.paginacion.hasta = 5;  
  } 

}
