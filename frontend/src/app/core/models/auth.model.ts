export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: string[];
}

export interface AuthError {
  success: false;
  message: string;
  error?: string;
} 