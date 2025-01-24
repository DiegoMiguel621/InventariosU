import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministradoresService {
  private apiUrl = 'http://localhost:3000/api/administradores'; // URL base de la API

  constructor(private http: HttpClient) {}

  // Obtener todos los administradores
  getAdministradores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener un administrador por ID
  getAdministradorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo administrador
  addAdministrador(administrador: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, administrador);
  }

  // Actualizar un administrador existente
  updateAdministrador(id: number, administrador: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, administrador);
  }

  // Eliminar un administrador
  deleteAdministrador(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
