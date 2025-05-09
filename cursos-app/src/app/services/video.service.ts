import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private baseUrl = 'https://demo-videos.onrender.com/api'; // URL base para todos los endpoints
  private videosUrl = `${this.baseUrl}/videos`;
  private userVideosUrl = `${this.baseUrl}/user-videos`;
  private documentVideosUrl = `${this.baseUrl}/documentos`;

  constructor(private http: HttpClient, private router: Router) { }

  // Método para obtener las cabeceras con el token de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      this.handleError(new HttpErrorResponse({status: 401}));
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403 || !localStorage.getItem('token')) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return throwError('Sesión expirada');
    }
    return throwError(error.error?.message || 'Error');
  }
  /* Métodos para administradores */
  
  // Obtener todos los videos (para administradores)
  getAllVideos(): Observable<any> {
    return this.http.get<any>(this.videosUrl, { 
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo video (para administradores)
  createVideo(videoData: any): Observable<any> {
    return this.http.post<any>(this.videosUrl, videoData, { 
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un video (para administradores)
  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.videosUrl}/${id}`, { 
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener los videos adquiridos por un usuario específico
  getPurchasedVideos(userId: number): Observable<any> {
    return this.http.get(`${this.userVideosUrl}/${userId}/videos`, { 
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Realizar la compra de un video para un usuario
  purchaseVideo(data: { user_id: number, video_id: number, precio_pagado: number }): Observable<any> {
    return this.http.post(
      `${this.userVideosUrl}/videos`,
      data,
      { 
        headers: this.getAuthHeaders(),
        withCredentials: true
      }
    ).pipe(
      catchError(this.handleError)
    );
  }
  
  // Obtener videos por categoría (para administradores o usuarios)
  getVideosByCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.videosUrl}/category/${categoryId}`, { 
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  getVideosCategories(): Observable<any> {
    return this.http.get<any>(`${this.videosUrl}/categorias`, { 
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  getDocumentsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.documentVideosUrl}/${id}`, { 
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  createDocument(videoData: any): Observable<any> {
    return this.http.post<any>(this.documentVideosUrl, videoData, { 
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteDocument(id: number): Observable<any> {
    return this.http.delete(`${this.documentVideosUrl}/${id}`, { 
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para probar CORS
  testCorsConnection(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cors-test`, { 
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
}