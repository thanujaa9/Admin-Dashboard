import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5050/api';

  constructor(private http: HttpClient, private auth: AuthService) {
    // Warm up Atlas connection after refresh/login
    if (this.auth.getToken()) {
      this.getDashboardStats().subscribe({
        next: () => {},
        error: () => {}
      });

      this.getUsers().subscribe({
        next: () => {},
        error: () => {}
      });
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
  }

  // Dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/stats`, {
      headers: this.getHeaders()
    });
  }

  // Users
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`, {
      headers: this.getHeaders()
    });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`, {
      headers: this.getHeaders()
    });
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, data, {
      headers: this.getHeaders()
    });
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, data, {
      headers: this.getHeaders()
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`, {
      headers: this.getHeaders()
    });
  }
}