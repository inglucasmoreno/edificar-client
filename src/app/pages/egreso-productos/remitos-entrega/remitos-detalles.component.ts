import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemitosEntregaService } from '../../../services/remitos-entrega.service';
import { EgresoService } from '../../../services/egreso.service';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-remitos-detalles',
  templateUrl: './remitos-detalles.component.html',
  styles: [
  ]
})
export class RemitosDetallesComponent implements OnInit {

  public id;
  public remito;
  public egreso;
  public productos = [];

  constructor(private remitosEntregaService: RemitosEntregaService,
              private alertService: AlertService,
              private dataService: DataService,
              private activatedRoute: ActivatedRoute,
              private egresoService: EgresoService) { }


  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Egresos";
    this.activatedRoute.params.subscribe(({id}) => {
      this.id = id;
      this.alertService.loading();
      this.getRemito();
    })
  }
  
  // Se traen los datos del remito
  getRemito(): void {
    this.remitosEntregaService.getRemito(this.id).subscribe( ({ remito }) => {
      this.remito = remito;
      this.egresoService.getEgreso(remito.egreso).subscribe(({egreso}) => {
        this.egreso = egreso;
        this.getProductos();
      },({error}) => {
        this.alertService.errorApi(error.msg);
      }     
      );
    },({error}) => {
      this.alertService.errorApi(error.msg);
    });  
  }

  // Se traen los productos del remito
  getProductos(): void {
    this.remitosEntregaService.listarProductosRemito(this.id).subscribe(({ productos }) => {
      this.productos = productos;
      this.alertService.close();
    },({error}) => {
      this.alertService.errorApi(error.msg);
    });
  }

}
