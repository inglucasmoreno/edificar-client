import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EgresoProductosService {

  constructor(private http: HttpClient) { }

  // Completar egreso
  completarEgreso(egreso: string, data: any): Observable<any>{
    return this.http.put(`${base_url}/egreso_productos/completar/${egreso}`, data,{
      headers: { 'x-token': localStorage.getItem('token') }
    });   
  }

  // Nuevo producto para el egreso
  nuevoProducto(data: any): Observable<any>{
    return this.http.post(`${base_url}/egreso_productos`, data, {
      headers: { 'x-token': localStorage.getItem('token') } 
    });
  }

  // Listar productos por egreso
  listarProductosPorEgreso(
    egreso: string,
    limit = 0, 
    desde = 0,
    estado = ''  
  ): Observable<any> {
    return this.http.get(`${base_url}/egreso_productos/${egreso}`, {
      params: {
        limit: String(limit),
        desde: String(desde),
        activo: String(estado), 
        direccion: '-1', 
        columna: 'createdAt' 
      },
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Ingreso parcial de producto
  egresoParcial(producto: string, data: any): Observable<any> {
    return this.http.put(`${base_url}/egreso_productos/parcial/${producto}`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    });   
  }

  // Eliminar producto del egreso
  eliminarProducto(producto: string): Observable<any> {
    return this.http.delete(`${base_url}/egreso_productos/${producto}`,{
      headers: {'x-token': localStorage.getItem('token')}
    })  
  }


}
