import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create headers with authentication token
   */
  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    
    return this.http.get<T>(url, {
      headers: this.createHeaders(),
      params: httpParams
    });
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    return this.http.post<T>(url, data, {
      headers: this.createHeaders()
    });
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    return this.http.put<T>(url, data, {
      headers: this.createHeaders()
    });
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    return this.http.delete<T>(url, {
      headers: this.createHeaders()
    });
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    return this.http.patch<T>(url, data, {
      headers: this.createHeaders()
    });
  }

  /**
   * POST request for file upload
   */
  upload<T>(endpoint: string, formData: FormData): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('accessToken');
    
    const headers = new HttpHeaders({
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
    
    return this.http.post<T>(url, formData, { headers });
  }
} 