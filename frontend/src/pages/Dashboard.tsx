import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, userService } from '../services/api';
import { AxiosError } from 'axios';
import '../styles/Dashboard.css';

/**
 * Componente Dashboard
 * 
 * Página principal para usuarios autenticados
 * Muestra:
 * - Perfil del usuario con opción de edición
 * - Lista de todos los usuarios registrados
 * - Paginación para la lista de usuarios
 */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  // Estado para lista de usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Estado para edición de perfil
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    password: '',
  });

  // Estado de carga y errores
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Cargar lista de usuarios al montar el componente
   */
  useEffect(() => {
    loadUsers();
  }, [pagination.page]);

  /**
   * Función para cargar usuarios
   */
  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await userService.getAllUsers(pagination.page, pagination.limit);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar la lista de usuarios');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  /**
   * Maneja cambios en el formulario de edición
   */
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Maneja el envío del formulario de edición
   */
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      // Solo enviar campos que cambiaron
      const updateData: any = {};
      if (editFormData.firstName !== user?.firstName) {
        updateData.firstName = editFormData.firstName;
      }
      if (editFormData.lastName !== user?.lastName) {
        updateData.lastName = editFormData.lastName;
      }
      if (editFormData.phone !== user?.phone) {
        updateData.phone = editFormData.phone;
      }
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      const response = await userService.updateProfile(updateData);
      updateUser(response.data);
      
      setSuccessMessage('Perfil actualizado exitosamente');
      setIsEditing(false);
      setEditFormData({ ...editFormData, password: '' });
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Error al actualizar perfil';
        setError(message);
      } else {
        setError('Error de conexión. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancela la edición del perfil
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      password: '',
    });
    setError(null);
  };

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Cambiar página de usuarios
   */
  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  if (!user) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Panel de Usuario</h1>
        <button onClick={handleLogout} className="btn-secondary">
          Cerrar Sesión
        </button>
      </header>

      {/* Mensajes de éxito/error */}
      {successMessage && (
        <div className="success-box">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {/* Sección de Perfil */}
      <section className="profile-section">
        <div className="section-header">
          <h2>Mi Perfil</h2>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              Editar Perfil
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="edit-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={editFormData.firstName}
                  onChange={handleEditChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={editFormData.lastName}
                  onChange={handleEditChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditChange}
                placeholder="Opcional"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Nueva Contraseña (dejar vacío para no cambiar)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={editFormData.password}
                onChange={handleEditChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-card">
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{user.firstName} {user.lastName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Teléfono:</span>
                <span className="info-value">{user.phone || 'No especificado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Miembro desde:</span>
                <span className="info-value">
                  {new Date(user.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Sección de Usuarios */}
      <section className="users-section">
        <h2>Usuarios Registrados</h2>

        {isLoadingUsers ? (
          <div className="loading">Cargando usuarios...</div>
        ) : (
          <>
            <div className="users-grid">
              {users.map((userData) => (
                <div key={userData.id} className="user-card">
                  <h3>{userData.firstName} {userData.lastName}</h3>
                  <p className="user-email">{userData.email}</p>
                  {userData.phone && <p className="user-phone">📞 {userData.phone}</p>}
                  <p className="user-date">
                    Registrado: {new Date(userData.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn-secondary"
                >
                  Anterior
                </button>
                <span className="page-info">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn-secondary"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
