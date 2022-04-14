import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { EgresoProductosService } from 'src/app/services/egreso-productos.service';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import { EgresoService } from '../../services/egreso.service';

@Component({
  selector: 'app-egreso-detalles',
  templateUrl: './egreso-detalles.component.html',
  styles: [
  ]
})
export class EgresoDetallesComponent implements OnInit {

  public id;
  public total = 0;

  public totalGeneral;

  // Egreso
  public egreso = {
    codigo_cadena: '',
    descripcion_cliente: ''
  };

  // Filtrado
  public filtro = {
    activo: ''
  }
  
  // Paginaciion
  public paginacion = {
    limit: 5,
    desde: 0,
    hasta: 5
  }
  
  public productos = [];

  constructor(private activatedRoute: ActivatedRoute,
              private alertService: AlertService,
              private dataService: DataService,
              private egresosService: EgresoService,
              private egresoProductosService: EgresoProductosService,
              private router: Router
              ) { }

  ngOnInit(): void {
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
    this.dataService.ubicacionActual = "Dashboard - Egresos - Detalles";
    this.activatedRoute.params.subscribe( ({id}) => {
      this.id = id;
      this.alertService.loading();
      this.egresosService.getEgreso(id).subscribe(({ egreso }) => {
        this.egreso = egreso;
        this.alertService.close();
        this.primerIngreso();
      },({error}) => {
        this.alertService.errorApi(error.msg);
      })         
    },({error}) => {
      this.alertService.errorApi(error.msg);
    });
  };

  // Primer ingreso a la vista
  primerIngreso(): void {
    this.alertService.loading();
    this.egresoProductosService.listarProductosPorEgreso(
      this.id,
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.activo
    ).subscribe(({productos, total, totalGeneral})=>{
      this.totalGeneral = totalGeneral;
      this.productos = productos;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    })  
  }

  // Listar productos de egreso
  listarProductos(): void {
    this.alertService.loading();
    this.egresoProductosService.listarProductosPorEgreso(
      this.id,
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.activo
    ).subscribe(({productos, total, totalGeneral})=>{
      this.totalGeneral = totalGeneral;
      this.productos = productos;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    })
  }

  // Completar Egreso
  completarEgreso(): void {

    // Se verifica si la nota de venta tiene productos
    if(this.totalGeneral <= 0){
      this.alertService.info('El egreso no tiene productos');
      return;
    }

    this.alertService.question({ msg: 'Estas por completar el egreso', buttonText: 'Completar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.alertService.loading();
            const data = {
              persona_empresa: this.egreso.descripcion_cliente,
              documento_codigo: this.egreso.codigo_cadena  
            };
            this.egresoProductosService.completarEgreso(this.id, data).subscribe(() => {
              this.alertService.close();
              this.router.navigateByUrl('/dashboard/egreso_productos'); 
            },({error})=>{
              this.alertService.errorApi(error.msg);
            });
          }
        });   
  }

  // Eliminar producto
  eliminarProducto(producto: string): void {
    this.alertService.question({ msg: 'Está por eliminar un producto', buttonText: 'Eliminar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.alertService.loading();
            this.egresoProductosService.eliminarProducto(producto).subscribe(()=>{
              this.listarProductos();
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
    this.listarProductos();
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
    this.listarProductos();
  }
  
  // Se reestablecen los valores de paginacion
  reiniciarPaginacion(): void {
    this.paginacion.limit = 5;
    this.paginacion.desde = 0;
    this.paginacion.hasta = 5;  
  } 

}
