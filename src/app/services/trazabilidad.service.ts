import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TrazabilidadService {

  constructor(private http: HttpClient) { }
  
  // Listar trazabilidad
  listarTrazabilidad(
    limit = 5, 
    desde = 5, 
    tipo: any = '', 
    producto: string = '',
    parametro: string = '',
    direccion: number = -1,
    columna: string = 'createdAt'
  ): Observable<any>{
    return this.http.get(`${base_url}/trazabilidad`, {
      params: {
        limit: String(limit),
        desde: String(desde),
        tipo,
        producto,
        parametro,
        direccion: String(direccion),
        columna
      },
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

}
