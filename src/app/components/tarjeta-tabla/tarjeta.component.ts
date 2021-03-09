import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styles: [
  ]
})
export class TarjetaComponent implements OnInit {

  @Input() borderColor = 'border-blue-500';
  @Input() backgroundColor = 'bg-gray-100';
  @Input() width = 'w-11/12 lg:w-1/2';

  constructor() { }

  ngOnInit(): void {
  }

}
