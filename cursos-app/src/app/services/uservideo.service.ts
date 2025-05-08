// src/app/services/uservideo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserVideoService {
  private apiUrl = 'http://localhost:5000/api/user-videos';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPurchasedVideos(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}/videos`, {
      headers: this.getHeaders()
    });
  }
}