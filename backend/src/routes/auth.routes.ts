import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerValidators, loginValidators } from '../validators/user.validators';

/**
 * Rutas de Autenticación
 * 
 * POST /api/auth/register - Registro de nuevos usuarios
 * POST /api/auth/login - Inicio de sesión
 */
const router = Router();
const authController = new AuthController();

// Registro de usuario
router.post('/register', registerValidators, authController.register);

// Login de usuario
router.post('/login', loginValidators, authController.login);

export default router;
