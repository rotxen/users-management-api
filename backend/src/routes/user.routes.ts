import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { updateProfileValidators } from '../validators/user.validators';

/**
 * Rutas de Usuarios
 * 
 * Todas las rutas requieren autenticación JWT
 * 
 * GET /api/users/profile - Obtener perfil del usuario autenticado
 * PUT /api/users/profile - Actualizar perfil del usuario autenticado
 * GET /api/users - Listar todos los usuarios (con paginación)
 */
const router = Router();
const userController = new UserController();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// Rutas de perfil
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidators, userController.updateProfile);

// Listar usuarios
router.get('/', userController.getAllUsers);

export default router;
