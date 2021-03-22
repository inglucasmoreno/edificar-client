import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pastilla-etapa',
  templateUrl: './pastilla-etapa.component.html',
  styles: [
  ]
})
export class PastillaEtapaComponent implements OnInit {

  constructor() { }

  @Input() estado: string = 'En proceso';

  ngOnInit(): void {
  }

}
