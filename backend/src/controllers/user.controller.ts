import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { validationResult } from 'express-validator';

/**
 * Controlador de Usuarios
 * 
 * Maneja operaciones CRUD sobre usuarios autenticados
 * Todos los endpoints requieren autenticación JWT
 */
export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * GET /api/users/profile
   * Obtiene el perfil del usuario autenticado
   * 
   * @param req - AuthRequest con datos del usuario en req.user
   * @param res - Response con datos del perfil
   */
  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user.toJSON(),
      });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener perfil',
      });
    }
  };

  /**
   * PUT /api/users/profile
   * Actualiza el perfil del usuario autenticado
   * 
   * Permite actualizar: firstName, lastName, phone, password
   * El email no se puede modificar por seguridad
   * 
   * @param req - AuthRequest con datos a actualizar
   * @param res - Response con usuario actualizado
   */
  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors: errors.array(),
        });
        return;
      }

      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      // Actualizar campos permitidos
      const { firstName, lastName, phone, password } = req.body;

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone !== undefined) user.phone = phone;
      if (password) user.password = password; // Se hasheará automáticamente

      await this.userRepository.save(user);

      res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: user.toJSON(),
      });
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar perfil',
      });
    }
  };

  /**
   * GET /api/users
   * Lista todos los usuarios registrados
   * 
   * Implementa paginación básica para mejorar rendimiento
   * 
   * @param req - AuthRequest con query params (page, limit)
   * @param res - Response con lista de usuarios
   */
  getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Parámetros de paginación
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Obtener usuarios con paginación
      const [users, total] = await this.userRepository.findAndCount({
        skip,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });

      // Convertir a JSON para excluir passwords
      const usersData = users.map((user) => user.toJSON());

      res.status(200).json({
        success: true,
        data: {
          users: usersData,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error al listar usuarios',
      });
    }
  };
}
