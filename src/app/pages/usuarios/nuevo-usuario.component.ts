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

  nuevoUsuario(): void {

    const { status } = this.usuarioForm;
    const { password, repetir } = this.usuarioForm.value;

    // Se verifica si los campos son invalidos
    if(status === 'INVALID'){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debe completar todos los campos',
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

    // Crear nuevo usuario
    this.usuariosService.nuevoUsuario(this.usuarioForm.value).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'El usuario ha sido creado',
        confirmButtonText: 'Entendido'
      });
      this.router.navigateByUrl('dashboard/usuarios');
    },( ({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'    
      });
      return;  
    }));
  }

}
