import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router) { }

  // Datos de usuario por ID
  getUsuario(id: string): Observable<any>{
    return this.http.get(`${base_url}/usuarios/${id}`, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    }).pipe(
      map( (resp: any) => resp.usuario)
    );
  }

  // Listar usuarios con paginador
  listarUsuarios(limit = 0, desde = 0, activo: any = '', parametro: string = ''): Observable<any>{
    return this.http.get(`${base_url}/usuarios`, {
      params: {
        limit: String(limit),
        desde: String(desde),
        activo,
        parametro
      },
      headers: {
      'x-token': localStorage.getItem('token')
      }
    });
  }

  // Nuevo usuario
  nuevoUsuario(data): Observable<any>{
    return this.http.post(`${base_url}/usuarios`, data, {headers: {
      'x-token': localStorage.getItem('token')
    }});
  }

  // Actualizar usuario
  actualizarUsuario(id, data): Observable<any>{
    return this.http.put(`${base_url}/usuarios/${id}`, data, { headers: {
      'x-token': localStorage.getItem('token')
    }});
  }

}
