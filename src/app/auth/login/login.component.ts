import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import gsap from 'gsap';

import { AuthService } from '../../services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {


  ngOnInit(): void {

    var tl = gsap.timeline({ defaults: { duration: 0.1 } });
    tl.from('.gsap-formulario', { y:-100, opacity: 0, duration: .5 })
      .from('.gsap-fondo', { y:100, opacity: 0, duration: .5 })
      .from('.gsap-imagen', { y:100, opacity: 0, duration: .5 });
  
  }

  public loginForm = this.fb.group({
    dni: ['', Validators.required],
    password: ['', Validators.required]
  });


  constructor(private fb: FormBuilder,
              private alertService: AlertService,
              private authService: AuthService,
              private router: Router) { }

  login(): void {
   
    if(this.loginForm.status !== 'VALID'){
      this.alertService.info('Debes completar todos los campos');
      return;
    }
    
    this.alertService.loading();

    this.authService.login(this.loginForm.value).subscribe( () => {
      this.alertService.close();
      this.router.navigateByUrl('dashboard/home');
    }, ({error}) => {
      this.loginForm.reset();
      this.alertService.errorApi(error.msg);
    });

  }

}
