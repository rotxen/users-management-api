import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

/**
 * Enrutador principal de la API
 * 
 * Agrupa todas las rutas bajo el prefijo /api
 * Facilita el mantenimiento y escalabilidad del proyecto
 */
const router = Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de usuarios
router.use('/users', userRoutes);

// Ruta de health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

export default router;
