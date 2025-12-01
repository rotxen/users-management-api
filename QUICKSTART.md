# Sistema de Gestión de Usuarios

## Instrucciones Rápidas de Instalación

### 1. Prerrequisitos
- Node.js v18+
- PostgreSQL v14+

### 2. Configurar Base de Datos

```powershell
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE users_management;
\q
```

### 3. Backend

```powershell
cd backend
npm install
# El archivo .env ya está configurado con valores por defecto
# Solo cambiar DB_PASSWORD si tu PostgreSQL tiene otra contraseña
npm run dev
```

### 4. Frontend (nueva terminal)

```powershell
cd frontend
npm install
npm run dev
```

### 5. Acceder
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Verificación

El backend mostrará:
```
 Conexión a PostgreSQL establecida
 Servidor iniciado
 Puerto: 3000
```

El frontend abrirá automáticamente el navegador en http://localhost:5173

## Primer Usuario

Registra un usuario de prueba:
- Nombre: Juan
- Apellido: Pérez
- Email: juan@test.com
- Password: Test123
- Teléfono: 1234567890 (opcional)

Para más detalles, ver README.md principal.
