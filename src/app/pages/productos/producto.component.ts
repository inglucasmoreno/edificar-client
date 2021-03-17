import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styles: [
  ]
})
export class ProductoComponent implements OnInit {

  public producto;
  public loading = true;

  constructor(
      private activatedRoute: ActivatedRoute,
      private productosService: ProductosService      
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id}) => {
      this.getProducto(id);
    })
  }

  getProducto(id: string): void {
    this.productosService.getProducto(id).subscribe( ({ producto }) => {
      this.producto = producto;
      this.loading = false;
    });   
  }

}
