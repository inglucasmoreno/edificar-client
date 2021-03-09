import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styles: [
  ]
})
export class EditarUsuarioComponent implements OnInit {

  public id: string;
  public usuario: Usuario;
  public usuarioForm = this.fb.group({
    dni: ['', Validators.required],
    apellido: ['', Validators.required],
    nombre: ['', Validators.required],
    email: ['', Validators.email],
    role: ['USER_ROLE', Validators.required],
    activo: [true, Validators.required],
  });
  public loading = true;

  constructor(private router: Router,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private usuariosService: UsuariosService,
              ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id}) => {
      this.id = id;
    });
    this.usuariosService.getUsuario(this.id).subscribe(usuario => {
      this.usuario = usuario;
      const {dni, apellido, nombre, email, role, activo} = this.usuario;
      this.usuarioForm.setValue({
        dni,
        apellido,
        nombre,
        email,
        role,
        activo
      });
      this.loading = false;
    });
  }

  // Editar usuario
  editarUsuario(): void | boolean{
    // Se verifica que todos los campos esten rellenos
    if (this.usuarioForm.status === 'INVALID'){
    Swal.fire({
      icon: 'info',
      title: 'Información',
      text: 'Debes completar todos los campos',
      confirmButtonText: 'Entendido'
    });
    return false;
    }

    this.usuariosService.actualizarUsuario(this.id, this.usuarioForm.value).subscribe(resp => {
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'Usuario actualizado correctamente',
        showConfirmButton: false,
        timer: 1000
      });
      this.loading = false;
      this.router.navigateByUrl('dashboard/usuarios');
    }, ({error}) => {
      this.loading = false;
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })
    });

  }

  regresar(): void{
    this.router.navigateByUrl('/dashboard/usuarios');
  }

}