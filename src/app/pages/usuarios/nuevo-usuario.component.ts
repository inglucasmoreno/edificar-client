import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import gsap from 'gsap';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styles: [
  ]
})
export class NuevoUsuarioComponent implements OnInit {
  
  // Modelo reactivo
  public usuarioForm = this.fb.group({
    dni: ['', Validators.required],
    apellido: ['', Validators.required],
    nombre: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    repetir: ['', Validators.required],
    role: ['ADMIN_ROLE', Validators.required],
    activo: [true, Validators.required]
  });

  constructor(private fb: FormBuilder,
              private alertService: AlertService,
              private dataService: DataService,
              private router: Router,
              private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .3 });
    this.dataService.ubicacionActual = 'Dashboard - Usuarios - Creando';
  }
  
  // Crear nuevo usuario
  nuevoUsuario(): void {

    const { status } = this.usuarioForm;
    const {dni, apellido, nombre, email, password, repetir} = this.usuarioForm.value;
    
    // Se verifica que los campos no tengan un espacio vacio
    const campoVacio = dni.trim() === '' || 
                       apellido.trim() === '' || 
                       email.trim() === '' || 
                       nombre.trim() === '' ||
                       password.trim() === '' ||
                       repetir.trim() === '';

    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || campoVacio){
      this.alertService.formularioInvalido();
      return;
    }

    // Se verifica si las contraseñas coinciden
    if(password !== repetir){
      this.alertService.info('Las contraseñas deben coincidir');
      return;   
    }

    this.alertService.loading();

    // Se crear el nuevo usuario
    this.usuariosService.nuevoUsuario(this.usuarioForm.value).subscribe(() => {
      this.alertService.close();
      this.router.navigateByUrl('dashboard/usuarios');
    },( ({error}) => {
      this.alertService.errorApi(error.msg); // Finaliza la creacion de usuario
      return;  
    }));

  }

}
