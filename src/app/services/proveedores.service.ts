import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  constructor(private http: HttpClient) {}
  
  listarProveedores(
    limit = 0, 
    desde = 0, 
    activo: any = '', 
    descripcion: string = '',
    direccion: number = 1,
    columna: string = 'razon_social'
  ): Observable<any>{
    return this.http.get(`${base_url}/proveedores`,{
      params:{
        limit: String(limit),
        desde: String(desde),
        activo,
        descripcion,
        direccion: String(direccion),
        columna
      },
      headers:{'x-token': localStorage.getItem('token')}
    });
  }

}
