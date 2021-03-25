import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { EgresoService } from '../../services/egreso.service';

@Component({
  selector: 'app-egreso-detalles',
  templateUrl: './egreso-detalles.component.html',
  styles: [
  ]
})
export class EgresoDetallesComponent implements OnInit {

  public loading = true;
  public egreso = {};

  constructor(private activatedRoute: ActivatedRoute,
              private egresosService: EgresoService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => {
      this.egresosService.getEgreso(id).subscribe(({egreso}) => {
        this.egreso = egreso;
        this.loading = false;    
      })         
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })
    })   
  }

}
