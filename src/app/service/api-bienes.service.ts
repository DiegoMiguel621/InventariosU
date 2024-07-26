import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiBienesService {
  private apiUrl = 'http://localhost/api-bienes';

  constructor(private http: HttpClient) {}

  getBienes(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getBienById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}`);
  }

  addBien(bien: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'x-www-form-urlencoded', 
      responseType: 'text' as 'json'  
     });
    return this.http.post<any>(`${this.apiUrl}/`, bien, { headers });
  }

  updateBien(id: number, bien: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, bien);
  }

  deleteBien(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
