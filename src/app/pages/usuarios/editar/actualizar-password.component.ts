import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-password',
  templateUrl: './actualizar-password.component.html',
  styles: [
  ]
})

export class ActualizarPasswordComponent implements OnInit {

  public id: string;
  public usuario: Usuario = {
    uid: '',
    dni: '',
    apellido: '',
    nombre: '',
    email: '',
  };
  public passwordForm = this.fb.group({
    password: ['', Validators.required],
    repetir: ['', Validators.required]
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private alertService: AlertService,
              private dataService: DataService,
              private activatedRoute: ActivatedRoute,
              private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Actualizando password";
    this.activatedRoute.params.subscribe(({id}) => {
      this.id = id;
      this.alertService.loading();
      this.usuariosService.getUsuario(id).subscribe( usuario => {
        this.usuario = usuario;
        this.alertService.close();
      });
    });
  }
    
  // Actualizar constraseña
  actualizarPassword(): void | boolean{
    const {password, repetir} = this.passwordForm.value;

    if (password.trim() === '' || repetir.trim() === ''){
      this.alertService.info('Debes completar todos los campos');
      return false;
    }

    if (password !== repetir){
      this.alertService.info('Las contraseñas deben coincidir');
      return false;
    }

    this.alertService.loading();

    this.usuario.password = password;
    this.usuariosService.actualizarUsuario(this.id, this.usuario).subscribe(() => {
      this.alertService.close();
      this.router.navigateByUrl('/dashboard/usuarios');
    }, ({error}) => {
      this.alertService.errorApi(error.msg);
    });

  }

}
