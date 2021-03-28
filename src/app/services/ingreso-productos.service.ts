import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class IngresoProductosService {

  constructor(private http: HttpClient) { }

  // Completar ingreso
  completarIngreso(ingreso: string): Observable<any>{
    return this.http.put(`${base_url}/ingreso_productos/completar/${ingreso}`,{},{
      headers: { 'x-token': localStorage.getItem('token') }
    });   
  }

  // Nuevo producto para el ingreso
  nuevoProducto(data: any): Observable<any>{
    return this.http.post(`${base_url}/ingreso_productos`, data, {
      headers: { 'x-token': localStorage.getItem('token') } 
    });
  }

  // Listar productos por Ingreso
  listarProductosPorIngreso(ingreso: string): Observable<any> {
    return this.http.get(`${base_url}/ingreso_productos/${ingreso}`, {
      params: { direccion: '-1', columna: 'createdAt' },
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Ingreso parcial de producto
  ingresoParcial(producto: string): Observable<any> {
    return this.http.put(`${base_url}/ingreso_productos/parcial/${producto}`,{} ,{
      headers: {'x-token': localStorage.getItem('token')}
    });   
  }

  // Eliminar producto del ingreso
  eliminarProducto(producto: string): Observable<any> {
    return this.http.delete(`${base_url}/ingreso_productos/${producto}`,{
      headers: {'x-token': localStorage.getItem('token')}
    })  
  }
  

}
