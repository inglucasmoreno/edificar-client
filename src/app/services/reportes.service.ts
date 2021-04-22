import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class ReportesService {

  constructor(private http: HttpClient) { }
  
  // Reporte - Usuarios
  usuarios(
    activo: any = '', 
    parametro: string = '',
    direccion: number = 1,
    columna: string = 'apellido'
  ): Observable<any>{
    return this.http.get(`${base_url}/reportes/usuarios`,{
      responseType: 'blob',
      params: {
        activo,
        parametro,
        direccion: String(direccion),
        columna
      },
      headers: { 
        'x-token': localStorage.getItem('token'),
        'Content-Type':"application/json"
      }
    });
  }

  // Reporte - Productos
  productos(
    activo: any = '', 
    descripcion: string = '',
    direccion: number = 1,
    columna: string = 'descripcion'
  ): Observable<any>{
    return this.http.get(`${base_url}/reportes/productos`,{
      responseType: 'blob',
      params: {
        activo,
        descripcion,
        direccion: String(direccion),
        columna
      },
      headers: { 
        'x-token': localStorage.getItem('token'),
        'Content-Type':"application/json"
      }
    });
  }

  // Reporte - Unidades
  unidades(
    activo: any = '', 
    descripcion: string = '',
    direccion: number = 1,
    columna: string = 'descripcion'  
  ): Observable<any>{
    return this.http.get(`${base_url}/reportes/unidades`,{
      responseType: 'blob',
      params: {
        activo,
        descripcion,
        direccion: String(direccion),
        columna
      },
      headers: { 
        'x-token': localStorage.getItem('token'),
        'Content-Type':"application/json"
      }
    });
  }

  // Reporte - proveedores
  proveedores(
    activo: any = '', 
    descripcion: string = '',
    direccion: number = 1,
    columna: string = 'razon_social'
  ): Observable<any>{
    return this.http.get(`${base_url}/reportes/proveedores`,{
      responseType: 'blob',
      params:{
        activo,
        descripcion,
        direccion: String(direccion),
        columna
      },
      headers: { 
        'x-token': localStorage.getItem('token'),
        'Content-Type':"application/json"
      }
    });
  }

  // Reportes - Ingresos
  ingresos(
    estado: string = '', 
    descripcion: string = '',
    direccion: number = 1,
    columna: string = 'createdAt' 
  ): Observable<any>{
    return this.http.get(`${base_url}/reportes/ingresos`,{
      responseType: 'blob',
      params:{
        estado,
        descripcion,
        direccion: String(direccion),
        columna
      },
      headers: { 'x-token': localStorage.getItem('token') }
    })
  }

  // Reportes - Egresos
  egresos(
    estado: string = '', 
    descripcion: string = '',
    direccion: number = 1,
    columna: string = 'codigo'
  ): Observable<any>{
    return this.http.get(`${base_url}/reportes/egresos`,{
      responseType: 'blob',
      params:{
        estado,
        descripcion,
        direccion: String(direccion),
        columna
      },
      headers: { 'x-token': localStorage.getItem('token') }
    })
  }

  // Reportes - Trazabilidad
  trazabilidad(
    tipo: any = '', 
    producto: string = '',
    parametro: string = '',
    direccion: number = -1,
    columna: string = 'createdAt',
    fechaAntes: string,
    fechaDespues: string
  ): Observable<any>{
    return this.http.get(`${base_url}/reportes/trazabilidad`,{
      responseType: 'blob',
      params:{
        tipo,
        producto,
        parametro,
        direccion: String(direccion),
        columna,
        fechaAntes: String(fechaAntes),
        fechaDespues: String(fechaDespues)  
      },
      headers: { 'x-token': localStorage.getItem('token') }
    })
  }

}
