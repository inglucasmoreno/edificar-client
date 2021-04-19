import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PresupuestosService {

  constructor(private http: HttpClient) { }

  // Generar PDF - presupuesto
  generarPresupuesto(data: any): Observable<any> {
    return this.http.post(`${base_url}/presupuestos`, data ,{
      headers: { 'x-token': localStorage.getItem('token') }
    });  
  }

}
