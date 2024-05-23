import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StteperFormService {
  private apiUrl = 'http://localhost:8000/schedulerASP/';

  constructor(private http: HttpClient) {}

  // ---------Timetable
  createTimeTable(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'timetables/', data);
  }

  getAllTimetables(): Observable<any> {
    return this.http.get(this.apiUrl + 'timetables/');
  }
  // ---------/Timetable

  // ---------Turns
  createAllTurns(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'turns/create_multiple/', data);
  }
  // ---------/Turns

  // ---------Workers
  createWorker(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'workers/create_multiple/', data);
  }
  // ---------/Workers
}
