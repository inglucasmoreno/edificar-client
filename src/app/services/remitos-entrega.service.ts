import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class RemitosEntregaService {

  constructor(private http: HttpClient) {}
  
  // Traer datos de remito por ID
  getRemito(remito: string): Observable<any>{
    return this.http.get(`${base_url}/remitos_entrega/getRemito/${remito}`,{
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Listar productos de un remito
  listarProductosRemito(remito: string): Observable<any>{
    return this.http.get(`${base_url}/remitos_entrega/getProductos/${remito}`, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Listar remitos de entrega
  listarRemitosEntrega(egreso: string): Observable<any> {
    return this.http.get(`${base_url}/remitos_entrega/${egreso}`, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Nuevo remito de entrega
  nuevoRemitoEntrega(data: any): Observable<any> {
    return this.http.post(`${base_url}/remitos_entrega`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Entrega parcial de producto
  entregaParcial(data: any): Observable<any> {
    return this.http.post(`${base_url}/remitos_entrega/parcial`, data, {
      headers: {'x-token': localStorage.getItem('token')}  
    })
  }

}
