import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { generateToken } from '../utils/jwt';
import { validationResult } from 'express-validator';

/**
 * Controlador de Autenticación
 * 
 * Maneja el registro y login de usuarios
 * Implementa validaciones robustas y manejo de errores detallado
 */
export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * POST /api/auth/register
   * Registra un nuevo usuario en el sistema
   * 
   * @param req - Request con datos del usuario (firstName, lastName, email, password, phone?)
   * @param res - Response con el usuario creado y token JWT
   */
  register = async (req: Request, res: Response): Promise<void> => {
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

      const { firstName, lastName, email, password, phone } = req.body;

      // Verificar si el email ya existe
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'El email ya está registrado',
        });
        return;
      }

      // Crear nuevo usuario
      const user = this.userRepository.create({
        firstName,
        lastName,
        email,
        password, // Se hasheará automáticamente por el hook @BeforeInsert
        phone,
      });

      await this.userRepository.save(user);

      // Generar token JWT
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: user.toJSON(),
          token,
        },
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar usuario',
      });
    }
  };

  /**
   * POST /api/auth/login
   * Autentica un usuario existente
   * 
   * @param req - Request con credenciales (email, password)
   * @param res - Response con datos del usuario y token JWT
   */
  login = async (req: Request, res: Response): Promise<void> => {
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

      const { email, password } = req.body;

      // Buscar usuario por email
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
        });
        return;
      }

      // Verificar contraseña
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
        });
        return;
      }

      // Generar token JWT
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: user.toJSON(),
          token,
        },
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
      });
    }
  };
}
