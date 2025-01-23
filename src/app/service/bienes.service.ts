import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BienesService {
  private apiUrl = 'http://localhost:3000/api/bienes'; // URL de la API

  constructor(private http: HttpClient) {}

  // Función para obtener los bienes desde la API
  getBienes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
   // Crear un nuevo bien (POST)
  addBien(bienData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bienData);
  }
  //Función para obtener un bien por su id
  getBien(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  //Funcion para eliminar un bien (DELETE)
  deleteBien(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
