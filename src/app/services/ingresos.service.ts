import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class IngresosService {
  constructor(private http : HttpClient) { }
  
  // Nuevo ingreso
  nuevoIngreso(data: any): Observable<any>{
    return this.http.post(`${base_url}/ingresos`, data, {
      headers: {'x-token' : localStorage.getItem('token')}
    });
  }

  // Listar ingresos
  listarIngresos(
    limit = 0, 
    desde = 0, 
    estado: string = '', 
    descripcion: string = '',
    direccion: number = 1,
    columna: string = 'createdAt' 
  ): Observable<any> {
    return this.http.get(`${base_url}/ingresos`,{
      params: {
        limit: String(limit),
        desde: String(desde),
        estado,
        descripcion,
        direccion: String(direccion),
        columna
      },
      headers: {
        'x-token': localStorage.getItem('token')
      }
  })  
  }

}
