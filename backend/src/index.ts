import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

// Cargar variables de entorno
dotenv.config();

/**
 * Clase principal de la aplicación
 * 
 * Decisiones de arquitectura:
 * - Estructura modular con separación de responsabilidades
 * - Middleware centralizado para CORS, JSON parsing y manejo de errores
 * - Inicialización de base de datos antes de levantar el servidor
 * - Configuración por variables de entorno para diferentes ambientes
 */
class App {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000');

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Configuración de middlewares globales
   */
  private initializeMiddlewares(): void {
    // CORS - Permitir requests desde el frontend
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
      })
    );

    // Body parser - Parsear JSON en requests
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logger básico en desarrollo
    if (process.env.NODE_ENV === 'development') {
      this.app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
      });
    }
  }

  /**
   * Configuración de rutas
   */
  private initializeRoutes(): void {
    // Ruta raíz
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'API de Gestión de Usuarios',
        version: '1.0.0',
        endpoints: {
          health: '/api/health',
          auth: '/api/auth',
          users: '/api/users',
        },
      });
    });

    // Rutas de la API
    this.app.use('/api', routes);
  }

  /**
   * Configuración del manejador global de errores
   */
  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  /**
   * Inicializa la conexión a la base de datos
   */
  private async initializeDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log('Conexión a PostgreSQL establecida');
      console.log(` Base de datos: ${process.env.DB_DATABASE}`);
    } catch (error) {
      console.error('Error al conectar con PostgreSQL:', error);
      process.exit(1);
    }
  }

  /**
   * Inicia el servidor Express
   */
  public async listen(): Promise<void> {
    try {
      // Primero inicializar la base de datos
      await this.initializeDatabase();

      // Luego levantar el servidor
      this.app.listen(this.port, () => {
        console.log('Servidor iniciado');
        console.log(`Puerto: ${this.port}`);
        console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
        console.log(`URL: http://localhost:${this.port}`);
        console.log('\n Endpoints disponibles:');
        console.log(`POST   http://localhost:${this.port}/api/auth/register`);
        console.log(`POST   http://localhost:${this.port}/api/auth/login`);
        console.log(`GET    http://localhost:${this.port}/api/users/profile`);
        console.log(`PUT    http://localhost:${this.port}/api/users/profile`);
        console.log(`GET    http://localhost:${this.port}/api/users`);
      });
    } catch (error) {
      console.error('Error al iniciar el servidor:', error);
      process.exit(1);
    }
  }
}

// Iniciar la aplicación
const app = new App();
app.listen();

export default app;
