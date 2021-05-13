import { Component, OnInit } from '@angular/core';
import { EgresoProductosService } from '../../../services/egreso-productos.service';
import { ActivatedRoute } from '@angular/router';
import { RemitosEntregaService } from '../../../services/remitos-entrega.service';
import Swal from 'sweetalert2';
import { EgresoService } from '../../../services/egreso.service';

@Component({
  selector: 'app-remitos-entrega',
  templateUrl: './remitos-entrega.component.html',
  styles: [
  ]
})
export class RemitosEntregaComponent implements OnInit {

  public loadingProductosInicio = true;
  public loadingRemitosInicio = true;

  public loadingProductos = false;
  public loadingRemitos = false;

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
              private egresoService: EgresoService,
              private activatedRoute: ActivatedRoute,
              private remitosEntregaService: RemitosEntregaService
              ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id})=>{
      this.id = id;
      this.datosRemito.egreso = id;
      this.listarProductos();
      this.listarRemitos();
      this.egresoService.getEgreso(id).subscribe(({ egreso }) => {
        this.egresoEstado = egreso.estado;
        this.egresoCliente = egreso.descripcion_cliente;
      },({error}) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
          confirmButtonText: 'Entendido'
        });
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
    Swal.fire({
      title: '¿Está seguro?',
      html: "Está por realizar una <b style='color: green'>entrega total</b>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Entregar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.datosRemito.punto_venta.trim() === '' || this.datosRemito.nro_comprobante.trim() === ''){
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Debe completar los datos del remito',
            confirmButtonText: 'Entendido'    
          });
          return;
        }
        this.loadingProductos = true;
        this.loadingRemitos = true;  
        this.remitosEntregaService.nuevoRemitoEntrega(this.datosRemito).subscribe(() => {
           txtPuntoVenta.value = '';
           txtNroComprobante.value = '';
           this.datosRemito.punto_venta = '';
           this.datosRemito.nro_comprobante = '';
           this.listarRemitos();
           this.listarProductos();
           this.parciales = [];
           this.loadingProductos = false;
           this.loadingRemitos = false;
           Swal.fire({
             icon: 'success',
             title: 'Completado',
             text: 'Entrega realizada correctamente!',
             timer: 1000,
             showConfirmButton: false
           });
        },({error}) => {
          txtPuntoVenta.value = '';
          txtNroComprobante.value = '';
          this.datosRemito.punto_venta = '';
          this.datosRemito.nro_comprobante = '';
          this.listarRemitos();
          this.listarProductos();
          this.parciales = [];
          this.loadingProductos = false;
          this.loadingRemitos = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
        });      
      };
    });
  }

  // Entregar parcial
  entregaParcial(txtPuntoVenta: any, txtNroComprobante: any): void {
  
    Swal.fire({
      title: '¿Está seguro?',
      html: "Está por realizar una <b style='color: orange'>entrega parcial</b>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Entregar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.datosRemito.punto_venta.trim() === '' || this.datosRemito.nro_comprobante.trim() === ''){
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Debe completar los datos del remito',
            confirmButtonText: 'Entendido'    
          });
          return;
        }  
        
        const productoParciales = this.parciales.filter(producto => producto.cantidad > 0);
        
        // Se evaluan las cantidades ingresadas
        // - No deben superar la cantidad a entregar
        let cantidadInvalida = false;
        productoParciales.forEach(producto => {
          if(producto.cantidad > producto.cantidad_restante){
            Swal.fire({
              icon: 'info',
              title: 'Información',
              text: `Cantidad inválida en ${producto.descripcion}`,
              confirmButtonText: 'Entendido' 
            })
            cantidadInvalida = true;  
          }
        })
        if(cantidadInvalida) return;

        if(productoParciales.length === 0){
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'No se seleccionó ningún producto',
            confirmButtonText: 'Entendido'
          });
          return;
        }

        const data = {
          punto_venta: txtPuntoVenta.value,
          nro_comprobante: txtNroComprobante.value,
          egreso: this.id,
          productos: productoParciales
        }

        this.loadingProductos = true;
        this.loadingRemitos = true;
        this.remitosEntregaService.entregaParcial(data).subscribe(resp => {
          txtPuntoVenta.value = '';
          txtNroComprobante.value = '';
          this.datosRemito.punto_venta = '';
          this.datosRemito.nro_comprobante = '';
          this.parciales = [];
          this.listarRemitos();
          this.listarProductos();
          this.loadingProductos = false;
          this.loadingRemitos = false;
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'Entrega realizada correctamente!',
            timer: 1000,
            showConfirmButton: false
          });
        },({error}) => {
          txtPuntoVenta.value = '';
          txtNroComprobante.value = '';
          this.datosRemito.punto_venta = '';
          this.datosRemito.nro_comprobante = '';
          this.parciales = [];
          this.listarRemitos();
          this.listarProductos();
          this.loadingProductos = false;
          this.loadingRemitos = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
        });
      };
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
      this.loadingProductosInicio = false;
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingProductosInicio = false;
    })
  }

  // Listar remitos de entrega
  listarRemitos(): void {
    this.remitosEntregaService.listarRemitosEntrega(this.id).subscribe(({ remitos }) => {
      this.remitos = remitos;
      this.loadingRemitosInicio = false;
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
      this.loadingRemitosInicio = false;
    });  
  }
}
