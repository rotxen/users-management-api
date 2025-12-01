# Sistema de Gestión de Usuarios

Sistema completo de gestión de usuarios con autenticación JWT, desarrollado con las últimas tecnologías del stack MERN (modificado con PostgreSQL).

## Descripción

Aplicación full-stack que permite registrar usuarios, autenticarse y gestionar perfiles de manera segura. Incluye un backend robusto con API REST y un frontend moderno e intuitivo.

**Características principales:**
- Registro e inicio de sesión seguro con JWT
- Gestión completa de perfiles de usuario
- Lista paginada de usuarios registrados
- Validaciones robustas en frontend y backend
- Arquitectura modular y escalable
- Documentación completa y detallada
- TypeScript en ambos lados para type safety

## Tecnologías Utilizadas

### Backend
- **Node.js** v18+ - Runtime de JavaScript
- **Express** - Framework web minimalista
- **TypeScript** - Superset de JavaScript con tipado estático
- **PostgreSQL** - Base de datos relacional robusta
- **TypeORM** - ORM para PostgreSQL con soporte TypeScript
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Hash seguro de contraseñas
- **express-validator** - Validación de requests HTTP

### Frontend
- **React** v18 - Biblioteca para interfaces de usuario
- **TypeScript** - Type safety en el cliente
- **Vite** - Build tool moderna y rápida
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP con interceptores
- **CSS3** - Estilos modernos sin frameworks

### DevOps & Tools
- **Git** - Control de versiones
- **npm** - Gestor de paquetes
- **ESLint** - Linting de código
- **dotenv** - Gestión de variables de entorno

## Estructura del Proyecto

```
users-management-api/
├── backend/                      # API REST con Node.js + Express
│   ├── src/
│   │   ├── config/              # Configuración (DB, etc.)
│   │   ├── controllers/         # Lógica de negocio
│   │   ├── entities/            # Modelos de TypeORM
│   │   ├── middleware/          # Middleware (auth, errors)
│   │   ├── routes/              # Definición de endpoints
│   │   ├── utils/               # Utilidades (JWT, etc.)
│   │   ├── validators/          # Validadores de requests
│   │   └── index.ts             # Punto de entrada
│   ├── .env.example             # Plantilla de variables de entorno
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md                # Documentación del backend
│
├── frontend/                     # Aplicación React
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   ├── context/             # Context API (Auth)
│   │   ├── pages/               # Páginas/Vistas
│   │   ├── services/            # Servicios API
│   │   ├── styles/              # Estilos CSS
│   │   ├── App.tsx              # Componente raíz
│   │   └── main.tsx             # Punto de entrada
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md                # Documentación del frontend
│
└── README.md                     # Este archivo (documentación general)
```

## Instalación y Configuración

### Prerrequisitos

- **Node.js** v18 o superior ([Descargar](https://nodejs.org/))
- **PostgreSQL** v14 o superior ([Descargar](https://www.postgresql.org/download/))
- **npm** (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com/))

### Pasos de Instalación

#### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd users-management-api
```

#### 2. Configurar PostgreSQL

```bash
# Conectarse a PostgreSQL (Windows con PowerShell)
psql -U postgres

# Dentro de psql, crear la base de datos
CREATE DATABASE users_management;

# Crear usuario (opcional)
CREATE USER app_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE users_management TO app_user;

# Salir
\q
```

#### 3. Configurar Backend

```bash
# Navegar a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
copy .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# Puedes usar: notepad .env
```

**Contenido del archivo `.env`:**
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_de_postgresql
DB_DATABASE=users_management

JWT_SECRET=mi-super-secreto-jwt-cambiar-en-produccion
JWT_EXPIRES_IN=7d
```

```bash
# Iniciar el servidor backend
npm run dev
```

El backend estará corriendo en `http://localhost:3000`

#### 4. Configurar Frontend (en otra terminal)

```bash
# Navegar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

## Uso

### 1. Acceder a la aplicación

Abrir el navegador en: `http://localhost:5173`

### 2. Registrar un usuario

1. Ir a la página de registro (clic en "Regístrate aquí")
2. Completar el formulario:
   - **Nombre**: Mínimo 2 caracteres
   - **Apellido**: Mínimo 2 caracteres
   - **Email**: Formato válido
   - **Teléfono**: Opcional, 10-20 dígitos
   - **Contraseña**: Mínimo 6 caracteres, debe incluir:
     - Al menos una letra mayúscula
     - Al menos una letra minúscula
     - Al menos un número
3. Confirmar la contraseña
4. Clic en "Crear Cuenta"

**Ejemplo de credenciales válidas:**
```
Nombre: Juan
Apellido: Pérez
Email: juan.perez@example.com
Teléfono: 1234567890
Contraseña: Password123
```

### 3. Iniciar sesión

1. Usar las credenciales creadas
2. Clic en "Iniciar Sesión"
3. Serás redirigido al Dashboard

### 4. Funcionalidades del Dashboard

**Ver Perfil:**
- Visualiza tu información personal
- Fecha de registro

**Editar Perfil:**
- Clic en "Editar Perfil"
- Modificar nombre, apellido, teléfono
- Cambiar contraseña (opcional)
- Guardar cambios

**Ver Usuarios:**
- Lista completa de usuarios registrados
- Paginación (10 usuarios por página)
- Información de cada usuario:
  - Nombre completo
  - Email
  - Teléfono
  - Fecha de registro

**Cerrar Sesión:**
- Clic en "Cerrar Sesión" en la esquina superior derecha

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Autenticación

**POST /api/auth/register**
- Descripción: Registra un nuevo usuario
- Body: `{ firstName, lastName, email, password, phone? }`
- Response: Usuario creado + token JWT

**POST /api/auth/login**
- Descripción: Inicia sesión
- Body: `{ email, password }`
- Response: Usuario + token JWT

#### Usuarios (requieren autenticación)

**GET /api/users/profile**
- Descripción: Obtiene perfil del usuario autenticado
- Headers: `Authorization: Bearer <token>`
- Response: Datos del usuario

**PUT /api/users/profile**
- Descripción: Actualiza perfil del usuario
- Headers: `Authorization: Bearer <token>`
- Body: `{ firstName?, lastName?, phone?, password? }`
- Response: Usuario actualizado

**GET /api/users**
- Descripción: Lista todos los usuarios
- Headers: `Authorization: Bearer <token>`
- Query Params: `page=1&limit=10`
- Response: Array de usuarios + info de paginación

### Ejemplo de Request (cURL)

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "Password123",
    "phone": "1234567890"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123"
  }'

# Obtener perfil (reemplazar <TOKEN> con el token recibido)
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <TOKEN>"
```

## Decisiones Técnicas

### Arquitectura General

El proyecto sigue una **arquitectura cliente-servidor** con separación completa entre frontend y backend, permitiendo escalabilidad independiente de cada capa.

### Backend: ¿Por qué estas tecnologías?

**TypeScript sobre JavaScript:**
- Type safety reduce errores en runtime
- Mejor experiencia de desarrollo
- Documentación implícita mediante tipos
- Refactoring más seguro

**TypeORM sobre Sequelize/Mongoose:**
- Soporte nativo de TypeScript con decoradores
- Sistema de migraciones robusto
- Active Record y Data Mapper patterns
- Abstracción de SQL manteniendo flexibilidad

**JWT sobre Sessions:**
- **Stateless**: No requiere almacenar sesiones en servidor
- **Escalabilidad horizontal**: Fácil de escalar a múltiples servidores
- **Cross-domain**: Funciona en diferentes dominios/subdominios
- **Mobile-friendly**: Ideal para apps móviles futuras

**express-validator:**
- Sanitización y validación robusta
- Middleware fácil de componer
- Mensajes de error personalizables
- Integración perfecta con Express

### Frontend: ¿Por qué estas tecnologías?

**React:**
- Componentes reutilizables
- Virtual DOM para rendimiento
- Hooks para lógica compartible
- Ecosistema maduro

**Vite sobre Create React App:**
- **HMR instantáneo**: Desarrollo más rápido
- **Build optimizado**: Rollup + code splitting
- **Configuración mínima**: TypeScript out-of-the-box
- **Moderno**: ES modules nativos

**Context API sobre Redux:**
- Suficiente para estado de autenticación simple
- Sin boilerplate innecesario
- Parte de React (cero dependencias)
- Curva de aprendizaje mínima

**CSS Vanilla sobre Tailwind/MUI:**
- Demuestra dominio de CSS puro
- Sin dependencias adicionales
- Control total sobre estilos

### Seguridad

**Implementada:**
- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- JWT con expiración configurable
- Validación de inputs en cliente y servidor
- Sanitización de datos
- CORS configurado
- Variables de entorno para secretos
- Passwords nunca se retornan en responses

### Validaciones

**Cliente (React):**
- Validación en tiempo real
- Feedback inmediato al usuario
- Reduce carga del servidor

**Servidor (Express):**
- Validación definitiva (nunca confiar en el cliente)
- express-validator con reglas estrictas
- Mensajes de error descriptivos

### Manejo de Errores

**Backend:**
- Middleware global de errores
- Códigos HTTP semánticos
- Mensajes descriptivos
- Logging de errores

**Frontend:**
- Try-catch en async operations
- Estados de error en UI
- Mensajes amigables al usuario
- Auto-logout en token expirado

## Troubleshooting

### Backend no inicia

**Error: "Cannot connect to PostgreSQL"**
- Verificar que PostgreSQL esté corriendo
- Revisar credenciales en `.env`
- Confirmar que la base de datos existe

**Error: "Port 3000 already in use"**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Frontend no carga

**Error: "Network Error"**
- Verificar que el backend esté corriendo en `http://localhost:3000`
- Revisar configuración de CORS en backend

**Error: "Token inválido"**
- Borrar localStorage: `localStorage.clear()` en consola del navegador
- Volver a iniciar sesión

### Problemas de instalación

**Error: "npm install failed"**
```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y package-lock.json
Remove-Item -Recurse -Force node_modules, package-lock.json

# Reinstalar
npm install
```

## Licencia

ISC - Este proyecto es de código abierto y está disponible bajo la licencia ISC.

## Agradecimientos

Desarrollado con dedicación como demostración de habilidades técnicas en:
- Arquitectura de software
- Desarrollo full-stack
- Mejores prácticas de seguridad
- Documentación profesional
- Comunicación técnica escrita

---

