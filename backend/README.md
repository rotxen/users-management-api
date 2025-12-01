# API de Gestión de Usuarios - Backend

API REST desarrollada con Node.js, Express, TypeScript, TypeORM y PostgreSQL para la gestión de usuarios con autenticación JWT.

## Tecnologías Utilizadas

- **Node.js** v18+ - Runtime de JavaScript
- **Express** v4.18 - Framework web
- **TypeScript** v5.3 - Tipado estático
- **TypeORM** v0.3 - ORM para PostgreSQL
- **PostgreSQL** v14+ - Base de datos relacional
- **JWT (jsonwebtoken)** - Autenticación basada en tokens
- **bcryptjs** - Hash de contraseñas
- **express-validator** - Validación de requests
- **dotenv** - Gestión de variables de entorno

## Prerrequisitos

- Node.js v18 o superior
- PostgreSQL v14 o superior
- npm o yarn

## Instalación y Configuración

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env` en la raíz del backend basándose en `.env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=users_management

# JWT Configuration
JWT_SECRET=tu-super-secret-jwt-key-cambiar-en-produccion
JWT_EXPIRES_IN=7d
```

### 3. Configurar base de datos PostgreSQL

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE users_management;

# Salir
\q
```

### 4. Ejecutar migraciones (opcional)

TypeORM sincroniza automáticamente en desarrollo. Para producción:

```bash
npm run migration:run
```

## Uso

### Modo desarrollo (con hot-reload)

```bash
npm run dev
```

### Compilar TypeScript

```bash
npm run build
```

### Modo producción

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints Disponibles

#### Autenticación

**POST /api/auth/register**

Registra un nuevo usuario.

Request:
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "Password123",
  "phone": "1234567890"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "phone": "1234567890",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt.token.here"
  }
}
```

**POST /api/auth/login**

Inicia sesión con credenciales existentes.

Request:
```json
{
  "email": "juan@example.com",
  "password": "Password123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": { ... },
    "token": "jwt.token.here"
  }
}
```

#### Usuarios (requieren autenticación)

**GET /api/users/profile**

Obtiene el perfil del usuario autenticado.

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "phone": "1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**PUT /api/users/profile**

Actualiza el perfil del usuario autenticado.

Headers:
```
Authorization: Bearer <token>
```

Request:
```json
{
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "phone": "9876543210",
  "password": "NewPassword123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": { ... }
}
```

**GET /api/users**

Lista todos los usuarios registrados (con paginación).

Headers:
```
Authorization: Bearer <token>
```

Query Params:
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Usuarios por página (default: 10)

Response (200):
```json
{
  "success": true,
  "data": {
    "users": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### Códigos de Estado

- `200` - OK
- `201` - Created
- `400` - Bad Request (errores de validación)
- `401` - Unauthorized (token inválido o ausente)
- `404` - Not Found
- `409` - Conflict (email duplicado)
- `500` - Internal Server Error

## Arquitectura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuración de TypeORM
│   ├── controllers/
│   │   ├── auth.controller.ts   # Lógica de autenticación
│   │   └── user.controller.ts   # Lógica de usuarios
│   ├── entities/
│   │   └── User.ts              # Entidad User de TypeORM
│   ├── middleware/
│   │   ├── auth.middleware.ts   # Middleware de autenticación JWT
│   │   └── error.middleware.ts  # Manejo global de errores
│   ├── routes/
│   │   ├── auth.routes.ts       # Rutas de autenticación
│   │   ├── user.routes.ts       # Rutas de usuarios
│   │   └── index.ts             # Agrupador de rutas
│   ├── utils/
│   │   └── jwt.ts               # Utilidades para JWT
│   ├── validators/
│   │   └── user.validators.ts   # Validadores con express-validator
│   └── index.ts                 # Punto de entrada principal
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Decisiones Técnicas

### ¿Por qué TypeScript?

- **Tipado estático**: Reduce errores en tiempo de desarrollo
- **IntelliSense mejorado**: Mejor experiencia de desarrollo
- **Refactoring seguro**: Cambios con confianza
- **Documentación implícita**: Los tipos documentan el código

### ¿Por qué TypeORM?

- **Excelente soporte de TypeScript**: Decoradores y tipado fuerte
- **Migraciones robustas**: Control de versiones de BD
- **Active Record y Data Mapper**: Flexibilidad en patrones
- **Abstracción de SQL**: Queries más legibles y mantenibles

### ¿Por qué JWT?

- **Stateless**: No requiere almacenar sesiones en servidor
- **Escalabilidad horizontal**: Fácil de escalar
- **Portabilidad**: Funciona en cualquier plataforma
- **Estándar de la industria**: Ampliamente adoptado

### Arquitectura Modular

El proyecto sigue el patrón **MVC (Model-View-Controller)** adaptado para APIs:

- **Models**: Entidades de TypeORM (`entities/`)
- **Controllers**: Lógica de negocio (`controllers/`)
- **Routes**: Definición de endpoints (`routes/`)
- **Middleware**: Lógica transversal (autenticación, errores)
- **Validators**: Validación de datos de entrada

### Seguridad Implementada

- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Validación de inputs con express-validator
- Autenticación JWT con expiración
- CORS configurado para frontend específico
- Variables de entorno para secretos
- Sanitización de respuestas (eliminar passwords)

## Convenciones de Código

- **Nomenclatura**: camelCase para variables/funciones, PascalCase para clases
- **Comentarios**: JSDoc para funciones públicas
- **Formato**: Prettier + ESLint (configuración estándar)
- **Commits**: Conventional Commits



