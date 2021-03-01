import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-formulario',
  templateUrl: './tarjeta-formulario.component.html',
  styles: [
  ]
})
export class TarjetaFormularioComponent implements OnInit {

  constructor() { }

  @Input() borderColor = 'border-yellow-500';
  @Input() backgroundColor = 'bg-white';

  ngOnInit(): void {
  }

}
