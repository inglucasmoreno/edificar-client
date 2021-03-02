import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icono-tabla',
  templateUrl: './icono-tabla.component.html',
  styles: [
  ]
})
export class IconoTablaComponent implements OnInit {

  constructor() { }

  @Input() icono = "fas fa-pencil-alt";
  @Input() titulo = "Editar";

  ngOnInit(): void {
  }

}
