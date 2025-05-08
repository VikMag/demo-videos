import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private baseUrl = 'https://demo-videos.onrender.com/api'; // URL base para todos los endpoints
  private videosUrl = `${this.baseUrl}/videos`;
  private userVideosUrl = `${this.baseUrl}/user-videos`;
  private documentVideosUrl = `${this.baseUrl}/documentos`;


  constructor(private http: HttpClient) { }

  // Método para obtener las cabeceras con el token de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /* Métodos para administradores */
  
  // Obtener todos los videos (para administradores)
  getAllVideos(): Observable<any> {
    return this.http.get<any>(this.videosUrl, { headers: this.getAuthHeaders() });
  }

  // Crear un nuevo video (para administradores)
  createVideo(videoData: any): Observable<any> {
    return this.http.post<any>(this.videosUrl, videoData, { headers: this.getAuthHeaders() });
  }

  // Eliminar un video (para administradores)
  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.videosUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Obtener los videos adquiridos por un usuario específico
  getPurchasedVideos(userId: number): Observable<any> {
    return this.http.get(`${this.userVideosUrl}/${userId}/videos`, { headers: this.getAuthHeaders() });
  }

  // Realizar la compra de un video para un usuario
  purchaseVideo(data: { user_id: number, video_id: number, precio_pagado: number }): Observable<any> {
    return this.http.post(
      `${this.userVideosUrl}/videos`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }
  
  // Obtener videos por categoría (para administradores o usuarios)
  getVideosByCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.videosUrl}/category/${categoryId}`, { headers: this.getAuthHeaders() });
  }

  getVideosCategories(): Observable<any> {
    return this.http.get<any>(`${this.videosUrl}/categorias`, { headers: this.getAuthHeaders() });
  }
    getDocumentsById(id: number): Observable<any> {
      return this.http.get<any>(`${this.documentVideosUrl}/${id}`, { headers: this.getAuthHeaders() });
    }
    createDocument(videoData: any): Observable<any> {
      return this.http.post<any>(this.documentVideosUrl, videoData, { headers: this.getAuthHeaders() });
    }

    deleteDocument(id: number): Observable<any> {
      return this.http.delete(`${this.documentVideosUrl}/${id}`, { headers: this.getAuthHeaders() });
    }
}
