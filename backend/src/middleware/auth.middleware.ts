import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

/**
 * Extensión de la interfaz Request de Express
 * Agrega la propiedad 'user' que contiene los datos del usuario autenticado
 */
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware de autenticación
 * 
 * Valida que el request tenga un token JWT válido en el header Authorization
 * Formato esperado: "Bearer <token>"
 * 
 * Si el token es válido, adjunta los datos del usuario a request.user
 * Si no, retorna error 401 Unauthorized
 * 
 * @param req - Request de Express extendido
 * @param res - Response de Express
 * @param next - Función next para continuar con el siguiente middleware
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Obtener el header de autorización
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido',
      });
      return;
    }

    // Verificar y decodificar el token
    const decoded = verifyToken(token);
    
    // Adjuntar datos del usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
  }
};
