import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styles: [
  ]
})
export class NuevoUsuarioComponent implements OnInit {

  public loading = false;
  
  // Modelo reactivo
  public usuarioForm = this.fb.group({
    dni: ['', Validators.required],
    apellido: ['', Validators.required],
    nombre: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    repetir: ['', Validators.required],
    role: ['USER_ROLE', Validators.required],
    activo: [true, Validators.required]
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private usuariosService: UsuariosService) { }

  ngOnInit(): void {}
  
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
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Formulario inválido',
        confirmButtonText: 'Entendido'  
      });
      return;
    }

    // Se verifica si las contraseñas coinciden
    if(password !== repetir){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Las contraseñas deben coincidir',
        confirmButtonText: 'Entendido'  
      });
      return;   
    }

    this.loading = true; 

    // Se crear el nuevo usuario
    this.usuariosService.nuevoUsuario(this.usuarioForm.value).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'El usuario ha sido creado',
        timer: 1000,
        showConfirmButton: false
      });
      this.loading = false;  // Finaliza la creacion de usuario
      this.router.navigateByUrl('dashboard/usuarios');
    },( ({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'    
      });
      this.loading = false;  // Finaliza la creacion de usuario
      return;  
    }));

  }

}
