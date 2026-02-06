import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrabajadoresService {
  private apiUrl = `${environment.apiUrl}/api/trabajadores`;

  constructor(private http: HttpClient) {}

  // Retorna solo trabajadores ACTIVO
  getTrabajadores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); 
  }
  // Retorna solo trabajadores INACTIVO
  getTrabajadoresInactivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inactivos`);
  }
  getTrabajadorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  addTrabajador(trabajador: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, trabajador);
  }
  deleteTrabajador(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  restoreTrabajador(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/restore/${id}`, {});
  }  
  updateTrabajador(idTrabajador: number, trabajador: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idTrabajador}`, trabajador);
  }

  getAreas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/areas`);
  }
  

  
  
  
  
  
  
  
  
  
}
