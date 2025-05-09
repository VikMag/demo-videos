import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://demo-videos.onrender.com/api/auth';
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }
  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, { headers: this.getHeaders() }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('rol', response.rol); // 'admin' o 'estudiante'
        localStorage.setItem('username', response.username);
        localStorage.setItem('user_id', response.id);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('rol') === 'admin';
  }

  isStudent(): boolean {
    return localStorage.getItem('rol') === 'estudiante';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('username');
  }
}