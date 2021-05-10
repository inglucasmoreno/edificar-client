import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RemitosEntregaService } from '../../../services/remitos-entrega.service';

@Component({
  selector: 'app-remitos-detalles',
  templateUrl: './remitos-detalles.component.html',
  styles: [
  ]
})
export class RemitosDetallesComponent implements OnInit {

  public id;
  public loadingDatos = true;
  public loadingProductos = true;
  public remito;
  public productos = [];

  constructor(private remitosEntregaService: RemitosEntregaService,
              private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id}) => {
      this.id = id;
      this.getRemito();
      this.getProductos();
    })
  }
  
  // Se traen los datos del remito
  getRemito(): void {
    this.remitosEntregaService.getRemito(this.id).subscribe( ({ remito }) => {
      this.remito = remito;
      this.loadingDatos = false;
    },({error}) => {
      this.loadingDatos = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
    });  
  }

  // Se traen los productos del remito
  getProductos(): void {
    this.remitosEntregaService.listarProductosRemito(this.id).subscribe(({ productos }) => {
      this.productos = productos;
      this.loadingProductos = false;
    },({error}) => {
      this.loadingProductos = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
    });
  }

}
