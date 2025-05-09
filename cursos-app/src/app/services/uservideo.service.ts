import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ 
  providedIn: 'root' 
})
export class UserVideoService {
  private apiUrl = 'https://demo-videos.onrender.com/api/user-videos';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getHeaders(): HttpHeaders {
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
      return throwError('Session expired. Please login again.');
    }
    return throwError(error.error?.message || 'An unexpected error occurred');
  }

  getPurchasedVideos(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}/videos`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }
}