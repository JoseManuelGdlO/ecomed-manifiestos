import { Injectable } from '@angular/core';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { LoginRequest, LoginResponse, User, AuthError } from '../models/auth.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class EcomedAuthService {
  private currentUser: User | null = null;
  private userChangeSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) {
    // Try to restore user from localStorage on service initialization
    this.restoreUserFromStorage();
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('EcomedAuthService: Login attempt', credentials);
    
    return this.apiService.post<LoginResponse>('/auth/login', credentials).pipe(
      tap(response => {
        console.log('EcomedAuthService: Login response', response);
        if (response.success) {
          // Store token
          localStorage.setItem('accessToken', response.data.token);
          
          // Store user data
          this.currentUser = response.data.user;
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          
                     // Update UserService for layout compatibility
           this.updateUserService(response.data.user);
           
           // Emit user change event
           this.userChangeSubject.next(response.data.user);
           
           console.log('EcomedAuthService: User stored', this.currentUser);
        }
      }),
      catchError(error => {
        console.error('EcomedAuthService: Login error:', error);
        return throwError(() => this.handleAuthError(error));
      })
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<boolean> {
    // Clear stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    
    // Clear UserService
    this.userService.user = null;
    
    return of(true);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('accessToken');
    const isAuth = !!token && !!this.currentUser;
    console.log('EcomedAuthService: isAuthenticated check', { token: !!token, currentUser: !!this.currentUser, isAuth });
    return of(isAuth);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get user token
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Get observable for user changes
   */
  getUserChanges(): Observable<User | null> {
    return this.userChangeSubject.asObservable();
  }

  /**
   * Check if user has specific role
   */
  hasRole(roleName: string): boolean {
    return this.currentUser?.rol?.nombre === roleName;
  }

  /**
   * Check if user has admin role
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    return this.currentUser?.rol?.permisos?.includes(permission) || false;
  }

  /**
   * Refresh user data from server
   */
  refreshUserData(): Observable<User> {
    return this.apiService.get<{success: boolean, data: User}>('/auth/me').pipe(
      map(response => {
        if (response.success) {
          this.currentUser = response.data;
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          return response.data;
        }
        throw new Error('Failed to refresh user data');
      }),
      catchError(error => {
        console.error('Error refreshing user data:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Restore user from localStorage
   */
  private restoreUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
                 this.currentUser = JSON.parse(userStr);
         // Also update UserService for layout compatibility
         this.updateUserService(this.currentUser);
         // Emit user change event
         this.userChangeSubject.next(this.currentUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('accessToken');
      }
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: any): AuthError {
    if (error.error?.message) {
      return {
        success: false,
        message: error.error.message
      };
    }
    
    if (error.status === 401) {
      return {
        success: false,
        message: 'Credenciales inválidas'
      };
    }
    
    if (error.status === 0) {
      return {
        success: false,
        message: 'No se puede conectar con el servidor'
      };
    }
    
    return {
      success: false,
      message: 'Error de autenticación'
    };
  }

  /**
   * Update UserService with our user data
   */
  private updateUserService(user: User): void {
    const fuseUser = {
      id: user.id.toString(),
      name: user.nombre_completo,
      email: user.correo,
      avatar: undefined, // No avatar for now
      status: 'online'
    };
    
    this.userService.user = fuseUser;
  }
} 