import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Configuración de Axios para comunicación con el backend
 * 
 * Decisión técnica: Axios fue elegido por:
 * - Interceptores para manejo centralizado de tokens
 * - Transformación automática de respuestas
 * - Manejo de errores más robusto que fetch
 * - Soporte de TypeScript excellent
 */

// Detectar si estamos en devtunnels o localhost para usar la URL correcta
const getBaseURL = (): string => {
  // Si hay variable de entorno, usarla
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Si estamos en devtunnels, usar la misma URL base + /api
  const currentHost = window.location.host;
  if (currentHost.includes('devtunnels.ms')) {
    return `${window.location.origin}/api`;
  }
  
  // Por defecto, localhost
  return 'http://localhost:3000/api';
};

const API_URL = getBaseURL();

/**
 * Instancia de Axios configurada para la API
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para agregar el token JWT a todas las peticiones
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para manejo centralizado de errores
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Si el token expiró, limpiar localStorage y redirigir a login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Tipos de datos
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

/**
 * Servicio de Autenticación
 */
export const authService = {
  /**
   * Registra un nuevo usuario
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Inicia sesión
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};

/**
 * Servicio de Usuarios
 */
export const userService = {
  /**
   * Obtiene el perfil del usuario autenticado
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>('/users/profile');
    return response.data;
  },

  /**
   * Actualiza el perfil del usuario autenticado
   */
  updateProfile: async (data: UpdateProfileData): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>('/users/profile', data);
    return response.data;
  },

  /**
   * Lista todos los usuarios
   */
  getAllUsers: async (page: number = 1, limit: number = 10): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>('/users', {
      params: { page, limit },
    });
    return response.data;
  },
};
