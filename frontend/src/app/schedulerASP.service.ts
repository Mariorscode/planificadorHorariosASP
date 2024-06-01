import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class schedulerASP {
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
  createAllWorker(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'workers/create_multiple/', data);
  }
  // ---------/Workers

  // ---------CommonWorkers

  createAllCommonWorkers(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'commonworkers/create_multiple/', data);
  }

  createCommonWorker(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'commonworkers/', data);
  }

  updateCommonWorker(workerId: number, data: any): Observable<any> {
    return this.http.put(this.apiUrl + 'commonworkers/' + workerId + '/', data);
  }

  getAllCommonWorkers(): Observable<any> {
    return this.http.get(this.apiUrl + 'commonworkers/');
  }

  getCommonWorkersByUserId(userId: number): Observable<any> {
    return this.http.get(this.apiUrl + 'commonworkers/?user_id=' + userId);
  }

  deleteCommonWorkerById(workerId: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'commonworkers/' + workerId + '/');
  }
  // ---------/CommonWorkers

  // --------- Space

  createAllSpace(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'spaces/create_multiple/', data);
  }

  getAllSpaces(): Observable<any> {
    return this.http.get(this.apiUrl + 'spaces/');
  }

  // getSpacesByUserId(userId: number): Observable<any> {
  //   return this.http.get(this.apiUrl + 'spaces/?user_id=' + userId);
  // }

  // ---------/Space

  // ---------CommonSpace
  getAllCommonSpaces(): Observable<any> {
    return this.http.get(this.apiUrl + 'commonspaces/');
  }

  createAllCommonSpace(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'commonspaces/create_multiple/', data);
  }
  // ---------/CommonSpace

  // ---------Tasks

  getAllscheduableTasks(): Observable<any> {
    return this.http.get(this.apiUrl + 'scheduabletasks/');
  }

  createAllscheduableTasks(data: any): Observable<any> {
    return this.http.post(
      this.apiUrl + 'scheduabletasks/create_multiple/',
      data
    );
  }

  // ---------/Tasks

  // ---------CommonTasks

  getAllCommonTasks(): Observable<any> {
    return this.http.get(this.apiUrl + 'commonscheduabletasks/');
  }

  createAllCommonTasks(data: any): Observable<any> {
    return this.http.post(
      this.apiUrl + 'commonscheduabletasks/create_multiple/',
      data
    );
  }

  // ---------/CommonTasks
}
