import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiBienesService {
  private apiUrl = 'http://localhost/api-bienes'; // URL de tu API

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  getBienes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Obtener un producto por ID
  getBien(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo producto
  createBien(bien: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bien);
  }

  // Actualizar un producto
  updateBien(id: string, bien: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, bien);
  }

  // Eliminar un producto
  deleteBien(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
