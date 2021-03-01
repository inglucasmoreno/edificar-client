import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-tabla',
  templateUrl: './tarjeta-tabla.component.html',
  styles: [
  ]
})
export class TarjetaTablaComponent implements OnInit {

  @Input() borderColor = 'border-yellow-500';
  @Input() backgroundColor = 'bg-white';

  constructor() { }

  ngOnInit(): void {
  }

}
