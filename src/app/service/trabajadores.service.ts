import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrabajadoresService {
  private apiUrl = 'http://localhost:3000/api/trabajadores';

  constructor(private http: HttpClient) {}

  getTrabajadores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getTrabajadorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  addTrabajador(trabajador: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/trabajadores', trabajador);
  }
  
  
  
  
}
