import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ReportesService } from '../../services/reportes.service';
import { saveAs } from 'file-saver-es';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  public showModal = false;

  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void {
  }

  descargarGuia(): void {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Está por descargar la guía de usuario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Descargar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: 'Descargando',
          html: 'Preparando guía...',
          timerProgressBar: true,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        });

        this.reportesService.guiaUsuarios().subscribe(guiaPDF => {
          Swal.close();
          saveAs(guiaPDF, `Guia de usuario.pdf`);
        },({error})=>{
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            showCancelButton: false,
            confirmButtonText: 'Entendido'
          });
        }); 
      }
    })
  }

}
