import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Payload del JWT Token
 * Contiene información mínima del usuario para mantener el token ligero
 */
export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Genera un token JWT para el usuario autenticado
 * 
 * Decisión técnica: JWT fue elegido por:
 * - Stateless authentication (no requiere almacenar sesiones en servidor)
 * - Facilita escalabilidad horizontal
 * - Incluye expiración automática
 * 
 * @param payload - Datos del usuario a incluir en el token
 * @returns Token JWT firmado
 */
export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verifica y decodifica un token JWT
 * 
 * @param token - Token JWT a verificar
 * @returns Payload decodificado si es válido
 * @throws Error si el token es inválido o expirado
 */
export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};
