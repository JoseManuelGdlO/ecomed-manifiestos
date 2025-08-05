export interface LoginRequest {
  correo: string;
  contrasena: string;
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
  nombre_completo: string;
  correo: string;
  id_rol: number;
  rol: Role;
}

export interface Role {
  id: number;
  nombre: string;
  descripcion?: string;
  permisos?: string[];
}

export interface AuthError {
  success: false;
  message: string;
  error?: string;
} 