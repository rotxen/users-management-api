import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

/**
 * Componente principal de la aplicación
 * 
 * Configura el enrutamiento y proveedores de contexto
 * 
 * Estructura de rutas:
 * - / (raíz) -> Redirige a /dashboard si está autenticado, sino a /login
 * - /login -> Página de inicio de sesión
 * - /register -> Página de registro
 * - /dashboard -> Panel principal (protegido)
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta raíz - redirige a dashboard o login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Ruta 404 - redirige a raíz */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
