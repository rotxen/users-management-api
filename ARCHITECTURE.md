# Diagrama de Arquitectura

## Vista General del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIO                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Páginas:                                           │    │
│  │  - Login.tsx                                        │    │
│  │  - Register.tsx                                     │    │
│  │  - Dashboard.tsx                                    │    │
│  └──────────────────────┬──────────────────────────────┘    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │  Context API (AuthContext)                          │    │
│  │  - Estado global de autenticación                   │    │
│  │  - Gestión de token JWT                             │    │
│  └──────────────────────┬──────────────────────────────┘    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │  Servicios API (Axios)                              │    │
│  │  - authService.register()                           │    │
│  │  - authService.login()                              │    │
│  │  - userService.getProfile()                         │    │
│  │  - userService.updateProfile()                      │    │
│  │  - userService.getAllUsers()                        │    │
│  └──────────────────────┬──────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API (JSON)
                         │ Authorization: Bearer <JWT>
                         │
┌────────────────────────▼────────────────────────────────────┐
│              BACKEND (Node.js + Express)                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Middleware Stack:                                  │    │
│  │  1. CORS                                            │    │
│  │  2. Body Parser (JSON)                              │    │
│  │  3. Logger (desarrollo)                             │    │
│  └──────────────────────┬──────────────────────────────┘    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │  Rutas (Routes):                                    │    │
│  │  /api/auth/register  (público)                      │    │
│  │  /api/auth/login     (público)                      │    │
│  │  /api/users/profile  (autenticado)                  │    │
│  │  /api/users          (autenticado)                  │    │
│  └──────────────────────┬──────────────────────────────┘    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │  Middleware de Autenticación (JWT)                  │    │
│  │  - Verifica token                                   │    │
│  │  - Decodifica payload                               │    │
│  │  - Adjunta user a request                           │    │
│  └──────────────────────┬──────────────────────────────┘    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │  Validadores (express-validator)                    │    │
│  │  - registerValidators                               │    │
│  │  - loginValidators                                  │    │
│  │  - updateProfileValidators                          │    │
│  └──────────────────────┬──────────────────────────────┘    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │  Controladores (Controllers):                       │    │
│  │  - AuthController                                   │    │
│  │    · register()                                     │    │
│  │    · login()                                        │    │
│  │  - UserController                                   │    │
│  │    · getProfile()                                   │    │
│  │    · updateProfile()                                │    │
│  │    · getAllUsers()                                  │    │
│  └──────────────────────┬──────────────────────────────┘    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │  TypeORM Repository                                 │    │
│  │  - UserRepository                                   │    │
│  │    · findOne()                                      │    │
│  │    · save()                                         │    │
│  │    · findAndCount()                                 │    │
│  └──────────────────────┬──────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ TypeORM
                         │
┌────────────────────────▼────────────────────────────────────┐
│                 PostgreSQL Database                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Tabla: users                                       │    │
│  │  ├─ id (UUID, PK)                                   │    │
│  │  ├─ firstName (VARCHAR)                             │    │
│  │  ├─ lastName (VARCHAR)                              │    │
│  │  ├─ email (VARCHAR, UNIQUE)                         │    │
│  │  ├─ password (VARCHAR, HASHED)                      │    │
│  │  ├─ phone (VARCHAR, NULLABLE)                       │    │
│  │  ├─ createdAt (TIMESTAMP)                           │    │
│  │  └─ updatedAt (TIMESTAMP)                           │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de Autenticación

```
┌────────┐                                    ┌────────┐
│ CLIENT │                                    │ SERVER │
└───┬────┘                                    └────┬───┘
    │                                              │
    │ POST /api/auth/register                     │
    │ { firstName, lastName, email, password }    │
    ├─────────────────────────────────────────────>│
    │                                              │
    │                                         ┌────▼────┐
    │                                         │ Validate│
    │                                         │  Input  │
    │                                         └────┬────┘
    │                                              │
    │                                         ┌────▼────┐
    │                                         │  Hash   │
    │                                         │Password │
    │                                         └────┬────┘
    │                                              │
    │                                         ┌────▼────┐
    │                                         │  Save   │
    │                                         │   User  │
    │                                         └────┬────┘
    │                                              │
    │                                         ┌────▼────┐
    │                                         │Generate │
    │                                         │   JWT   │
    │                                         └────┬────┘
    │                                              │
    │  { success: true, data: { user, token } }    │
    │<─────────────────────────────────────────────┤
    │                                              │
┌───▼────┐                                         │
│ Store  │                                         │
│ Token  │                                         │
│LocalStr│                                         │
└───┬────┘                                         │
    │                                              │
    │ GET /api/users/profile                       │
    │ Authorization: Bearer <token>                │
    ├─────────────────────────────────────────────>│
    │                                              │
    │                                         ┌────▼────┐
    │                                         │ Verify  │
    │                                         │  Token  │
    │                                         └────┬────┘
    │                                              │
    │                                         ┌────▼────┐
    │                                         │  Get    │
    │                                         │  User   │
    │                                         └────┬────┘
    │                                              │
    │  { success: true, data: user }               │
    │<─────────────────────────────────────────────┤
    │                                              │
```

## Modelo de Datos (Entity-Relationship)

```
┌─────────────────────────────────────┐
│            USERS TABLE              │
├─────────────────────────────────────┤
│ PK  id              UUID            │
│     firstName       VARCHAR(100)    │
│     lastName        VARCHAR(100)    │
│ UK  email           VARCHAR(255)    │
│     password        VARCHAR(255)    │ ← Hasheado con bcrypt
│     phone           VARCHAR(20)     │ ← Nullable
│     createdAt       TIMESTAMP       │ ← Auto
│     updatedAt       TIMESTAMP       │ ← Auto
└─────────────────────────────────────┘

Índices:
- PRIMARY KEY (id)
- UNIQUE INDEX (email)

Constraints:
- email UNIQUE NOT NULL
- password NOT NULL (hasheado)
- firstName NOT NULL
- lastName NOT NULL
```

## Ciclo de Vida de un Request

### Ejemplo: Actualizar Perfil

```
1. Usuario edita perfil en Dashboard.tsx
                ↓
2. handleEditSubmit() llama userService.updateProfile()
                ↓
3. Axios interceptor agrega token JWT al header
                ↓
4. Request HTTP PUT /api/users/profile
   Headers: { Authorization: "Bearer <token>" }
   Body: { firstName: "Juan", lastName: "Pérez" }
                ↓
5. Express recibe request
                ↓
6. CORS middleware valida origen
                ↓
7. Body parser convierte JSON a objeto
                ↓
8. Router /api/users redirige a userRoutes
                ↓
9. authenticateToken middleware:
   - Extrae token del header
   - Verifica y decodifica JWT
   - Adjunta user a req.user
                ↓
10. updateProfileValidators validan datos
                ↓
11. UserController.updateProfile():
    - Obtiene userId de req.user
    - Busca usuario en DB
    - Actualiza campos
    - Guarda (password se hashea automáticamente)
    - Retorna usuario actualizado
                ↓
12. Response JSON:
    { success: true, data: { id, firstName, lastName, ... } }
                ↓
13. Frontend recibe response
                ↓
14. AuthContext.updateUser() actualiza estado global
                ↓
15. UI se re-renderiza con nuevos datos
```

## Seguridad: Capas de Protección

```
┌─────────────────────────────────────────────┐
│  Layer 1: Frontend Validation               │
│  - Formato de email                         │
│  - Longitud de contraseña                   │
│  - Confirmación de contraseña               │
│  - Campos requeridos                        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Layer 2: HTTPS (Producción)                │
│  - Encriptación en tránsito                 │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Layer 3: CORS                              │
│  - Solo origins permitidos                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Layer 4: express-validator                 │
│  - Sanitización de inputs                   │
│  - Validación estricta                      │
│  - Normalización de datos                   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Layer 5: JWT Authentication                │
│  - Verificación de firma                    │
│  - Validación de expiración                 │
│  - Decodificación de payload                │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Layer 6: bcrypt Password Hashing           │
│  - Salt rounds: 10                          │
│  - One-way hash                             │
│  - Comparación segura                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Layer 7: Database Constraints              │
│  - Email unique                             │
│  - NOT NULL validations                     │
│  - Type checking                            │
└─────────────────────────────────────────────┘
```

## Tecnologías por Capa

```
┌──────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                   │
│  React + TypeScript + React Router + CSS             │
│  - Componentes reutilizables                         │
│  - Context API para estado global                    │
│  - Rutas protegidas                                  │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                 SERVICE LAYER                        │
│  Axios                                               │
│  - HTTP client con interceptores                     │
│  - Transformación automática de datos                │
│  - Manejo centralizado de errores                    │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                 API LAYER                            │
│  Express + TypeScript                                │
│  - Routing                                           │
│  - Middleware pipeline                               │
│  - Request/Response handling                         │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                 BUSINESS LOGIC LAYER                 │
│  Controllers + Validators                            │
│  - Lógica de negocio                                 │
│  - Validación y sanitización                         │
│  - Transformación de datos                           │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                 DATA ACCESS LAYER                    │
│  TypeORM                                             │
│  - Repository pattern                                │
│  - Query builder                                     │
│  - Migrations                                        │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                 DATABASE LAYER                       │
│  PostgreSQL                                          │
│  - Persistencia de datos                             │
│  - Constraints                                       │
│  - Transacciones                                     │
└──────────────────────────────────────────────────────┘
```

Este documento proporciona una visión completa de la arquitectura del sistema.
