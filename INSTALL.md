# Instalación Rápida - 5 Minutos

## Requisitos Previos
- Node.js v18+ instalado
- PostgreSQL instalado y corriendo

## Paso 1: Crear Base de Datos (1 minuto)

```powershell
# Abrir PowerShell y conectar a PostgreSQL
psql -U postgres

# Dentro de psql, ejecutar:
CREATE DATABASE users_management;
\q
```

## Paso 2: Backend (2 minutos)

```powershell
# Abrir terminal en la carpeta del proyecto
cd users-management-api/backend

# Instalar dependencias
npm install

# El archivo .env ya está configurado
# Solo cambiar DB_PASSWORD si tu PostgreSQL tiene otra contraseña
# Editar: notepad .env

# Iniciar servidor
npm run dev
```

Verás: ` Conexión a PostgreSQL establecida` y `Servidor iniciado`

## Paso 3: Frontend (2 minutos)

```powershell
# Abrir NUEVA terminal
cd users-management-api/frontend

# Instalar dependencias
npm install

# Iniciar aplicación
npm run dev
```

Se abrirá automáticamente `http://localhost:5173` en tu navegador

## ¡Listo!

### Probar la aplicación:

1. **Registrarte:**
   - Nombre: `Juan`
   - Apellido: `Pérez`
   - Email: `test@example.com`
   - Password: `Test123` (debe tener mayúscula, minúscula y número)
   - Teléfono: `1234567890` (opcional)

2. **Explorar:**
   - Ver tu perfil
   - Editar tu información
   - Ver lista de usuarios
   - Cerrar sesión

---

## Solución Rápida de Problemas

### Backend no inicia

**Error: "Cannot connect to PostgreSQL"**
```powershell
# Verificar que PostgreSQL esté corriendo
Get-Service postgresql*

# Si no está corriendo, iniciarlo
Start-Service postgresql-x64-14  # Ajustar nombre según versión
```

**Error: "Port 3000 already in use"**
```powershell
# Matar proceso en puerto 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### Frontend no carga

**Error en consola del navegador**
- Verificar que el backend esté corriendo en http://localhost:3000
- Refrescar la página (F5)

**Problema de autenticación**
```javascript
// Abrir consola del navegador (F12) y ejecutar:
localStorage.clear()
// Luego refrescar la página e intentar de nuevo
```

---

## Siguientes Pasos

1. **Leer documentación completa:** `README.md`
2. **Ver arquitectura:** `ARCHITECTURE.md`
3. **Probar API manualmente:** `API_EXAMPLES.md`
4. **Ejecutar tests:** `.\test-api.ps1`

---

## ¿Necesitas Ayuda?

Si algo no funciona:

1. Verificar versiones:
   ```powershell
   node --version    # Debe ser v18+
   npm --version     # Debe ser v9+
   psql --version    # Debe ser v14+
   ```

2. Verificar servicios:
   ```powershell
   # PostgreSQL corriendo?
   Get-Service postgresql*
   
   # Backend corriendo?
   Test-NetConnection localhost -Port 3000
   
   # Frontend corriendo?
   Test-NetConnection localhost -Port 5173
   ```

3. Revisar logs en las terminales donde ejecutaste `npm run dev`

4. Consultar `TECHNICAL_CHECKLIST.md` para debugging avanzado

---
