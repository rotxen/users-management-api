import { Request, Response, NextFunction } from 'express';

/**
 * Middleware global de manejo de errores
 * 
 * Captura todos los errores no manejados en la aplicación
 * y retorna una respuesta JSON estructurada
 * 
 * Decisión técnica: Centralizar el manejo de errores permite:
 * - Respuestas consistentes en toda la API
 * - Logging centralizado
 * - Ocultar detalles de implementación en producción
 * 
 * @param err - Error capturado
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - Función next (requerida por Express error handler)
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Determinar código de estado
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    // Solo mostrar stack trace en desarrollo
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
