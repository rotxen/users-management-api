import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authService, userService } from '../services/api';

/**
 * Context de Autenticación
 * 
 * Maneja el estado global de autenticación de la aplicación
 * Persiste el token y datos del usuario en localStorage
 * 
 * Decisión técnica: Context API fue elegido por:
 * - Evitar prop drilling en componentes anidados
 * - Estado global sin dependencias externas (Redux, Zustand)
 * - Suficiente para el alcance del proyecto
 */

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider del contexto de autenticación
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Cargar usuario y token desde localStorage al montar el componente
   */
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Validar que el token sigue siendo válido obteniendo el perfil
          try {
            const response = await userService.getProfile();
            setUser(response.data);
          } catch (error) {
            // Token inválido, limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  /**
   * Función de login
   */
  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const { user, token } = response.data;

    setUser(user);
    setToken(token);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  /**
   * Función de registro
   */
  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    const response = await authService.register({
      firstName,
      lastName,
      email,
      password,
      phone,
    });
    const { user, token } = response.data;

    setUser(user);
    setToken(token);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  /**
   * Función de logout
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  /**
   * Actualizar usuario en el estado
   */
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
