import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://demo-videos.onrender.com/api/users';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return throwError('Your session has expired. Please log in again.');
    }
    return throwError(error.error?.message || 'An unexpected error occurred');
  }

  sendFeedback(subject: string, video: string, message: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/feedback`, 
      { subject, video, message }, 
      { 
        headers: this.getAuthHeaders(),
        withCredentials: true 
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { 
      headers: this.getAuthHeaders(),
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`, { 
      headers: this.getAuthHeaders(),
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, user, { 
      headers: this.getAuthHeaders(),
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`, { 
      headers: this.getAuthHeaders(),
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }
}