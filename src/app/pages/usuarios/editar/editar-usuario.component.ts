import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

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

  constructor(private router: Router,
              private alertService: AlertService,
              private dataService: DataService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private usuariosService: UsuariosService,
              ) { }

  ngOnInit(): void {
    
    this.dataService.ubicacionActual = "Dashboard - Usuarios - Actualizando";
    
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .3 });
    this.activatedRoute.params.subscribe(({id}) => {
      this.id = id;
    });
    
    this.alertService.loading();
    
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
      this.alertService.close();
    });
  
  }

  // Editar usuario
  editarUsuario(): void | boolean{
      
    const {dni, apellido, nombre, email, repetir} = this.usuarioForm.value;

    // Se verifica que los campos no tengan un espacio vacio
    const campoVacio = dni.trim() === '' || 
    apellido.trim() === '' || 
    email.trim() === '' || 
    nombre.trim() === '';

    // Se verifica que todos los campos esten rellenos
    if (this.usuarioForm.status === 'INVALID' || campoVacio){
      this.alertService.formularioInvalido();
      return false;
    }

    this.alertService.loading();

    this.usuariosService.actualizarUsuario(this.id, this.usuarioForm.value).subscribe(resp => {
      this.alertService.close()
      this.router.navigateByUrl('dashboard/usuarios');
    }, ({error}) => {
      this.alertService.errorApi(error.msg);
    });

  }

}