import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-mini-fomulario',
  templateUrl: './tarjeta-mini-fomulario.component.html',
  styles: [
  ]
})
export class TarjetaMiniFomularioComponent implements OnInit {

  constructor() { }

  @Input() borderColor = 'border-yellow-500';
  @Input() backgroundColor = 'bg-white';

  ngOnInit(): void {
  }

}
