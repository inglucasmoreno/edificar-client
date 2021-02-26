import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private router: Router,
              private authService: AuthService){}
  
  // Porque estamos usando lazyload
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.validarToken()
    .pipe(
      tap(
         estaAutenticado => {
           if (!estaAutenticado){ this.router.navigateByUrl('/login'); }
         }
      )
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>{
    return this.authService.validarToken()
               .pipe(
                 tap(
                    estaAutenticado => {
                      if (!estaAutenticado){ this.router.navigateByUrl('/login'); }
                    }
                 )
               );
  }

}