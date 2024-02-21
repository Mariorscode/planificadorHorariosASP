import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8000'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {}

  obtenerDatos(): Observable<any[]> {
    const url = `${this.apiUrl}/eventos/eventos`; // Reemplaza 'tu-ruta' con la ruta específica de tu API
    return this.http.get<any[]>(url);
  }
}
