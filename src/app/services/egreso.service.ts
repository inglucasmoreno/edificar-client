import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EgresoService {
  constructor(private http:HttpClient) { }

  // Egreso por ID
  getEgreso(id: string): Observable<any> {
    return this.http.get(`${base_url}/egresos/${id}`, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Nuevo egreso
  nuevoEgreso(data: any): Observable<any> {
    return this.http.post(`${base_url}/egresos`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    });  
  }

  // Listar egresos
  listarEgresos(
    limit = 0, 
    desde = 0, 
    estado: string = '', 
    descripcion: string = '',
    direccion: number = 1,
    columna: string = 'codigo' 
  ): Observable<any> {
    return this.http.get(`${base_url}/egresos`,{
      params: {
        limit: String(limit),
        desde: String(desde),
        estado,
        descripcion,
        direccion: String(direccion),
        columna
      },
      headers:{ 'x-token': localStorage.getItem('token') }
    })
  }

  // Actualizar egreso
  actualizarEgreso(id: string, data: any): Observable<any>{
    return this.http.put(`${base_url}/egresos/${id}`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    })  
  }

}
