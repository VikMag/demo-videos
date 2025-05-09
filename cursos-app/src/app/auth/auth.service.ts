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
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, { 
      headers: this.getHeaders(),
      withCredentials: true // Agregado para mantener la sesión
    }).pipe(
      tap(response => {
        if (response && response.token) { // Validación básica de respuesta
          localStorage.setItem('token', response.token);
          localStorage.setItem('rol', response.rol);
          localStorage.setItem('username', response.username);
          localStorage.setItem('user_id', response.id);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && token.split('.').length === 3; // Validación básica de formato JWT
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && localStorage.getItem('rol') === 'admin';
  }

  isStudent(): boolean {
    return this.isLoggedIn() && localStorage.getItem('rol') === 'estudiante';
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token && token !== 'undefined' && token !== 'null' ? token : null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
  }
}