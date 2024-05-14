import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StteperFormService {
  private apiUrl = 'http://localhost:8000/schedulerASP/';

  constructor(private http: HttpClient) {}

  createTurns(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'turns/create_multiple/', data);
  }
}
