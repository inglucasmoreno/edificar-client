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

  public id;
  public egresoEstado = '';
  public datosRemito = {
    dato_1: '',
    dato_2: '',
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
    console.log(this.parciales);
  }
  
  // Entregar todos los productos
  entregaTotal(txtDato1: any, txtDato2: any): void {
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
        if(this.datosRemito.dato_1.trim() === '' || this.datosRemito.dato_2.trim() === ''){
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Debe completar los datos del remito',
            confirmButtonText: 'Entendido'    
          });
          return;
        }  
        this.remitosEntregaService.nuevoRemitoEntrega(this.datosRemito).subscribe(() => {
           txtDato1.value = '';
           txtDato2.value = '';
           this.datosRemito.dato_1 = '';
           this.datosRemito.dato_2 = '';
           this.listarRemitos();
           this.listarProductos();
           this.parciales = [];
           Swal.fire({
             icon: 'success',
             title: 'Completado',
             text: 'Entrega realizada correctamente!',
             timer: 1000,
             showConfirmButton: false
           });
        },({error}) => {
          txtDato1.value = '';
          txtDato2.value = '';
          this.datosRemito.dato_1 = '';
          this.datosRemito.dato_2 = '';
          this.listarRemitos();
          this.listarProductos();
          this.parciales = [];
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
  entregaParcial(txtDato1: any, txtDato2: any): void {
  
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
        if(this.datosRemito.dato_1.trim() === '' || this.datosRemito.dato_2.trim() === ''){
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
          console.log(producto.cantidad > producto.cantidad_restante);
          if(producto.cantidad > producto.cantidad_restante){
            Swal.fire({
              icon: 'info',
              title: 'Información',
              text: 'Cantidad inválida',
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
          dato_1: txtDato1.value,
          dato_2: txtDato2.value,
          egreso: this.id,
          productos: productoParciales
        }
        this.remitosEntregaService.entregaParcial(data).subscribe(resp => {
          txtDato1.value = '';
          txtDato2.value = '';
          this.datosRemito.dato_1 = '';
          this.datosRemito.dato_2 = '';
          this.parciales = [];
          this.listarRemitos();
          this.listarProductos();
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'Entrega realizada correctamente!',
            timer: 1000,
            showConfirmButton: false
          });
        },({error}) => {
          txtDato1.value = '';
          txtDato2.value = '';
          this.datosRemito.dato_1 = '';
          this.datosRemito.dato_2 = '';
          this.parciales = [];
          this.listarRemitos();
          this.listarProductos();
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
        this.parciales.push({id: producto._id, cantidad: 0, cantidad_restante: producto.cantidad_restante}); 
      });
    })
  }

  // Listar remitos de entrega
  listarRemitos(): void {
    this.remitosEntregaService.listarRemitosEntrega(this.id).subscribe(({ remitos }) => {
      this.remitos = remitos;
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
    });  
  }
}
