import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styles: [
  ]
})
export class ProductoComponent implements OnInit {

  public producto;

  constructor(
      private activatedRoute: ActivatedRoute,
      private dataService: DataService,
      private alertService:AlertService,
      private productosService: ProductosService      
    ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Productos - Detalles";
    this.activatedRoute.params.subscribe(({id}) => {
      this.getProducto(id);
    })
  }

  getProducto(id: string): void {
    this.alertService.loading();
    this.productosService.getProducto(id).subscribe( ({ producto }) => {
      this.producto = producto;
      this.alertService.close();
    });   
  }

}
