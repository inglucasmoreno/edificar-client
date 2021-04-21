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
  usuarios(): Observable<any>{
    return this.http.get(`${base_url}/reportes/usuarios`,{
      responseType: 'blob',
      headers: { 
        'x-token': localStorage.getItem('token'),
        'Content-Type':"application/json"
      }
    });
  }

  // Reporte - Productos
  productos(): Observable<any>{
    return this.http.get(`${base_url}/reportes/productos`,{
      responseType: 'blob',
      headers: { 
        'x-token': localStorage.getItem('token'),
        'Content-Type':"application/json"
      }
    });
  }

}
