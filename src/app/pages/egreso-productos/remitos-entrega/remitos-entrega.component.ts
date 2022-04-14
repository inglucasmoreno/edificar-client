import { Component, OnInit } from '@angular/core';
import { EgresoProductosService } from '../../../services/egreso-productos.service';
import { ActivatedRoute } from '@angular/router';
import { RemitosEntregaService } from '../../../services/remitos-entrega.service';
import Swal from 'sweetalert2';
import { EgresoService } from '../../../services/egreso.service';
import { DataService } from 'src/app/services/data.service';
import { AlertService } from 'src/app/services/alert.service';
import gsap from 'gsap';

@Component({
  selector: 'app-remitos-entrega',
  templateUrl: './remitos-entrega.component.html',
  styles: [
  ]
})
export class RemitosEntregaComponent implements OnInit {

  public id;
  public egresoEstado = '';
  public egresoCliente = '';

  public datosRemito = {
    punto_venta: '',
    nro_comprobante: '',
    egreso: ''  
  }
  public remitos = [];
  public productos = [];
  public parciales = [];

  constructor(private egresoProductosService: EgresoProductosService,
              private dataService: DataService,
              private alertService: AlertService,
              private egresoService: EgresoService,
              private activatedRoute: ActivatedRoute,
              private remitosEntregaService: RemitosEntregaService
              ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Egresos";
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
    this.activatedRoute.params.subscribe(({id})=>{
      this.id = id;
      this.datosRemito.egreso = id;
      this.alertService.loading();
      this.listarProductos();
      this.listarRemitos();
      this.egresoService.getEgreso(id).subscribe(({ egreso }) => {
        this.egresoEstado = egreso.estado;
        this.egresoCliente = egreso.descripcion_cliente;
      },({error}) => {
        this.alertService.errorApi(error.msg);
      });
    });
  }

  // Completando datos de remito
  completandoDatosRemito(selector: string, valor: string): void {
    this.datosRemito[selector] = valor;
  }

  // Actualizar productos - Entrega parcial
  actualizandoProductos(id, valor): void {
    // Actualizando parciales
    this.parciales.find(resp => { resp.id === id ? resp.cantidad = Number(valor) : null; })
  }
  
  // Entregar todos los productos
  entregaTotal(txtPuntoVenta: any, txtNroComprobante: any): void {
    this.alertService.question({ msg: 'Está por realizar una entrega total', buttonText: 'Entregar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        if(this.datosRemito.punto_venta.trim() === '' || this.datosRemito.nro_comprobante.trim() === ''){
          this.alertService.info('Debe completar los datos del remito');
          return;
        }
        this.alertService.loading();
        this.remitosEntregaService.nuevoRemitoEntrega(this.datosRemito).subscribe(() => {
           txtPuntoVenta.value = '';
           txtNroComprobante.value = '';
           this.datosRemito.punto_venta = '';
           this.datosRemito.nro_comprobante = '';
           this.listarRemitos();
           this.listarProductos();
           this.parciales = [];
           this.alertService.success('Entrega realizada correctamente!');
        },({error}) => {
          txtPuntoVenta.value = '';
          txtNroComprobante.value = '';
          this.datosRemito.punto_venta = '';
          this.datosRemito.nro_comprobante = '';
          this.listarRemitos();
          this.listarProductos();
          this.parciales = [];
          this.alertService.errorApi(error.msg);
        });          
      }
    });    
  }

  // Entregar parcial
  entregaParcial(txtPuntoVenta: any, txtNroComprobante: any): void {
  
    this.alertService.question({ msg: 'Está por realizar una entrega parcial', buttonText: 'Entregar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        if(this.datosRemito.punto_venta.trim() === '' || this.datosRemito.nro_comprobante.trim() === ''){
          this.alertService.info('Debe completar los datos del remito');
          return;
        }  
        
        const productoParciales = this.parciales.filter(producto => producto.cantidad > 0);
        
        // Se evaluan las cantidades ingresadas
        // - No deben superar la cantidad a entregar
        let cantidadInvalida = false;
        productoParciales.forEach(producto => {
          if(producto.cantidad > producto.cantidad_restante){
            this.alertService.info(`Cantidad inválida en ${producto.descripcion}`);
            cantidadInvalida = true;  
          }
        })
        if(cantidadInvalida) return;

        if(productoParciales.length === 0){
          this.alertService.info('No se seleccionó ningún producto');
          return;
        }

        const data = {
          punto_venta: txtPuntoVenta.value,
          nro_comprobante: txtNroComprobante.value,
          egreso: this.id,
          productos: productoParciales
        }

        this.alertService.loading();
        
        this.remitosEntregaService.entregaParcial(data).subscribe(resp => {
          txtPuntoVenta.value = '';
          txtNroComprobante.value = '';
          this.datosRemito.punto_venta = '';
          this.datosRemito.nro_comprobante = '';
          this.parciales = [];
          this.listarRemitos();
          this.listarProductos();
          this.alertService.success('Entrega realizada correctamente!');
        },({error}) => {
          txtPuntoVenta.value = '';
          txtNroComprobante.value = '';
          this.datosRemito.punto_venta = '';
          this.datosRemito.nro_comprobante = '';
          this.parciales = [];
          this.listarRemitos();
          this.listarProductos();
          this.alertService.errorApi(error.msg);
        });
      }
    });
        
  }

  // Listado de productos
  listarProductos(): void {
    this.egresoProductosService.listarProductosPorEgreso(
      this.id, 0, 0, 'true'
    ).subscribe(({ productos }) => {
      this.productos = productos; 
      // Se crean los productos parciales - Solo si tienen cantidades restantes
      this.productos.forEach(producto => { 
        this.parciales.push({id: producto._id, descripcion: producto.producto.descripcion, cantidad: 0, cantidad_restante: producto.cantidad_restante}); 
      });

      this.alertService.close();

    },({error}) => {
      this.alertService.errorApi(error.msg);
    })
  }

  // Listar remitos de entrega
  listarRemitos(): void {
    this.remitosEntregaService.listarRemitosEntrega(this.id).subscribe(({ remitos }) => {
      this.remitos = remitos;
      this.alertService.close();
    },({error}) => {
      this.alertService.errorApi(error.msg);
    });  
  }
}
