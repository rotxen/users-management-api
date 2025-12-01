import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración de la conexión a la base de datos PostgreSQL
 * Utiliza TypeORM como ORM para facilitar las operaciones CRUD y migraciones
 * 
 * Decisión técnica: TypeORM fue elegido por su excelente soporte de TypeScript,
 * sistema de migraciones robusto y active record/data mapper patterns
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'users_management',
  synchronize: process.env.NODE_ENV === 'development', // Solo en desarrollo
  logging: process.env.NODE_ENV === 'development',
  entities: [User],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
