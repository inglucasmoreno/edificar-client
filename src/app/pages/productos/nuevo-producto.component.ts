import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styles: [
  ]
})
export class NuevoProductoComponent implements OnInit {

  public loading = false;

  constructor() { }

  ngOnInit(): void {
  }

}
