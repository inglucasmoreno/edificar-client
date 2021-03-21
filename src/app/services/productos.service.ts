import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Producto } from '../models/producto.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http: HttpClient) { }
  
  // Listar productos
  listarProductos(
    limit = 0, 
    desde = 0, 
    activo: any = '', 
    descripcion: string = '',
    direccion: number = 1,
    columna: string = 'descripcion'
  ): Observable<any> {
    return this.http.get(`${base_url}/productos`,{
      params: {
        limit: String(limit),
        desde: String(desde),
        activo,
        descripcion,
        direccion: String(direccion),
        columna
      },
      headers: {
        'x-token': localStorage.getItem('token')
      }
    });  
  }

  // Producto por ID
  getProducto(id: string): Observable<any> {
    return this.http.get(`${base_url}/productos/${id}`, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    })
  }

  // Nuevo producto
  nuevoProducto(data: Producto): Observable<any> {
    return this.http.post(`${base_url}/productos`, data, { 
      headers: {
        'x-token': localStorage.getItem('token') 
      }
    });
  }

  // Actualizar producto
  actualizarProducto( id: string, data: any): Observable<any> {
    return this.http.put(`${base_url}/productos/${id}`, data, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    });
  }


}
