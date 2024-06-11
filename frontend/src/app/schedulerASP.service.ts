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
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(this.apiUrl + 'users/', { headers });
  }

  postDataWithToken(postData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post<any>(`${this.apiUrl}timetables/`, postData, {
      headers,
    });
  }

  getDataWithToken(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get<any>(`http://127.0.0.1:8000/home/`, { headers });
  }

  getUserByUserName(userName: string): Observable<any> {
    return this.http.get(
      this.apiUrl + 'users/get_user_by_username/?username=' + userName
    );
  }

  // ---------/User

  // ---------Timetable
  createTimeTable(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(this.apiUrl + 'timetables/', data, { headers });
  }

  getAllTimetablesByUserId() {
    // localStorage.setItem('userId', userId.toString());
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(this.apiUrl + 'timetables/?user_id=' + userId, {
      headers,
    });
  }

  deleteTimetable(timetableId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(this.apiUrl + 'timetables/' + timetableId + '/', {
      headers,
    });
  }

  generateTimetable(timetable_id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(
      `${this.apiUrl}timetables/generateTimetable/?timetable_id=${timetable_id}`,
      { headers }
    );
  }

  // ---------/Timetable

  // ---------Turns
  createAllTurns(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(this.apiUrl + 'turns/create_multiple/', data, {
      headers,
    });
  }
  // ---------/Turns

  // ---------Workers
  createAllWorker(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(this.apiUrl + 'workers/create_multiple/', data, {
      headers,
    });
  }
  // ---------/Workers

  // ---------CommonWorkers

  createAllCommonWorkers(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(
      this.apiUrl + 'commonworkers/create_multiple/',
      data,
      { headers }
    );
  }

  createCommonWorker(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(this.apiUrl + 'commonworkers/', data, { headers });
  }

  updateCommonWorker(workerId: number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(
      this.apiUrl + 'commonworkers/' + workerId + '/',
      data,
      { headers }
    );
  }

  getAllCommonWorkers(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(this.apiUrl + 'commonworkers/', { headers });
  }

  getCommonWorkersByUserId(): Observable<any> {
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(this.apiUrl + 'commonworkers/?user_id=' + userId, {
      headers,
    });
  }

  deleteCommonWorkerById(workerId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(this.apiUrl + 'commonworkers/' + workerId + '/', {
      headers,
    });
  }
  // ---------/CommonWorkers

  // --------- Space

  createAllSpace(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(this.apiUrl + 'spaces/create_multiple/', data, {
      headers,
    });
  }

  getAllSpaces(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(this.apiUrl + 'spaces/', { headers });
  }

  // ---------/Space

  // ---------CommonSpace
  getAllCommonSpaces(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(this.apiUrl + 'commonspaces/', { headers });
  }

  createAllCommonSpace(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(this.apiUrl + 'commonspaces/create_multiple/', data, {
      headers,
    });
  }

  createCommonSpace(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(this.apiUrl + 'commonspaces/', data, { headers });
  }

  updateCommonSpace(spaceId: number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(this.apiUrl + 'commonspaces/' + spaceId + '/', data, {
      headers,
    });
  }

  getCommonSpacesByUserId(): Observable<any> {
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(this.apiUrl + 'commonspaces/?user_id=' + userId, {
      headers,
    });
  }

  deleteCommonSpaceById(spaceId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(this.apiUrl + 'commonspaces/' + spaceId + '/', {
      headers,
    });
  }

  // ---------/CommonSpace

  // ---------Tasks

  getAllscheduableTasks(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(this.apiUrl + 'scheduabletasks/', { headers });
  }

  createAllscheduableTasks(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(
      this.apiUrl + 'scheduabletasks/create_multiple/',
      data,
      { headers }
    );
  }

  // ---------/Tasks

  // ---------CommonTasks

  getAllCommonTasks(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(this.apiUrl + 'commonscheduabletasks/', { headers });
  }

  createAllCommonTasks(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(
      this.apiUrl + 'commonscheduabletasks/create_multiple/',
      data,
      { headers }
    );
  }

  createCommonTasks(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(this.apiUrl + 'commonscheduabletasks/', data, {
      headers,
    });
  }

  updateCommonTasks(taskId: number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(
      this.apiUrl + 'commonscheduabletasks/' + taskId + '/',
      data,
      { headers }
    );
  }

  getCommonTasksByUserId(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(
      this.apiUrl +
        'commonscheduabletasks/?user_id=' +
        localStorage.getItem('userId'),
      { headers }
    );
  }

  deleteCommonTasksById(taskId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(
      this.apiUrl + 'commonscheduabletasks/' + taskId + '/',
      { headers }
    );
  }

  // ---------/CommonTasks

  // ---------Schedule

  createSchedule(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(this.apiUrl + 'schedules/', data, { headers });
  }

  createAllSchedules(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(this.apiUrl + 'schedules/create_multiple/', data, {
      headers,
    });
  }

  getAllSchedulesByTimeTableId(timeTableId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(
      this.apiUrl + 'schedules/?timeTable_schedule=' + timeTableId,
      { headers }
    );
  }

  deleteScheduleById(scheduleId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(this.apiUrl + 'schedules/' + scheduleId + '/', {
      headers,
    });
  }
  // ---------/Schedule
}
