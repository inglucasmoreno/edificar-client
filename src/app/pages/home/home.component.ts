import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ReportesService } from '../../services/reportes.service';
import { saveAs } from 'file-saver-es';
import { DataService } from 'src/app/services/data.service';
import gsap from 'gsap';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  constructor(private reportesService: ReportesService,
              private alertService: AlertService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Home';
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .5 });
  } 

  descargarGuia(): void {
    this.alertService.question({ msg: 'Está por descargar la guía de usuario', buttonText: 'Descargar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.alertService.loading();
            this.reportesService.guiaUsuarios().subscribe(guiaPDF => {
              this.alertService.close();
              saveAs(guiaPDF, `Guia de usuario.pdf`);
            },({error})=>{
              this.alertService.errorApi(error.msg);
            }); 
          }
        });    
  }
  
}
