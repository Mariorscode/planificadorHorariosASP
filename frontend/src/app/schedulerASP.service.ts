import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class schedulerASP {
  private apiUrl = 'http://localhost:8000/schedulerASP/';

  constructor(private http: HttpClient) {}

  // ---------User
  createUser(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'users/', data);
  }

  createToken(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/token/', data);
  }

  getAllUsersWithToken(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Prefijo "Bearer " seguido del token
    });
    return this.http.get(this.apiUrl + 'users/', { headers });
  }

  postDataWithToken(token: string, postData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Prefijo "Bearer " seguido del token
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(`${this.apiUrl}timetables/`, postData, {
      headers,
    });
  }

  getDataWithToken(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Prefijo "Bearer " seguido del token
    });
    return this.http.get<any>(`http://127.0.0.1:8000/home/`, { headers });
  }
  // ---------Timetable
  createTimeTable(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'timetables/', data);
  }

  getAllTimetablesByUserId(userId: number) {
    return this.http.get(this.apiUrl + 'timetables/?user_id=' + userId);
  }

  deleteTimetable(timetableId: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'timetables/' + timetableId + '/');
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

  // ---------/Space

  // ---------CommonSpace
  getAllCommonSpaces(): Observable<any> {
    return this.http.get(this.apiUrl + 'commonspaces/');
  }

  createAllCommonSpace(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'commonspaces/create_multiple/', data);
  }

  createCommonSpace(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'commonspaces/', data);
  }

  updateCommonSpace(spaceId: number, data: any): Observable<any> {
    return this.http.put(this.apiUrl + 'commonspaces/' + spaceId + '/', data);
  }

  getCommonSpacesByUserId(userId: number): Observable<any> {
    return this.http.get(this.apiUrl + 'commonspaces/?user_id=' + userId);
  }

  deleteCommonSpaceById(spaceId: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'commonspaces/' + spaceId + '/');
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

  createCommonTasks(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'commonscheduabletasks/', data);
  }

  updateCommonTasks(taskId: number, data: any): Observable<any> {
    return this.http.put(
      this.apiUrl + 'commonscheduabletasks/' + taskId + '/',
      data
    );
  }

  getCommonTasksByUserId(userId: number): Observable<any> {
    return this.http.get(
      this.apiUrl + 'commonscheduabletasks/?user_id=' + userId
    );
  }

  deleteCommonTasksById(taskId: number): Observable<any> {
    return this.http.delete(
      this.apiUrl + 'commonscheduabletasks/' + taskId + '/'
    );
  }

  // ---------/CommonTasks

  // ---------Schedule

  createSchedule(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'schedules/', data);
  }

  createAllSchedules(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'schedules/create_multiple/', data);
  }

  getAllSchedulesByTimeTableId(timeTableId: number): Observable<any> {
    return this.http.get(
      this.apiUrl + 'schedules/?timeTable_schedule=' + timeTableId
    );
  }

  deleteScheduleById(scheduleId: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'schedules/' + scheduleId + '/');
  }
  // ---------/Schedule
}
