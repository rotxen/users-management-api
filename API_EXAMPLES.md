# Ejemplos de Uso de la API

Este documento contiene ejemplos prácticos de cómo usar cada endpoint de la API.

## Base URL

```
http://localhost:3000/api
```

## Variables de Entorno

Para los ejemplos, usaremos:
- `BASE_URL`: http://localhost:3000/api
- `TOKEN`: El JWT token recibido al autenticarse

---

## 1. Registro de Usuario

### Request

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "password": "Password123",
  "phone": "1234567890"
}
```

### cURL

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "password": "Password123",
    "phone": "1234567890"
  }'
```

### PowerShell

```powershell
$body = @{
    firstName = "Juan"
    lastName = "Pérez"
    email = "juan.perez@example.com"
    password = "Password123"
    phone = "1234567890"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### Response Success (201)

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan.perez@example.com",
      "phone": "1234567890",
      "createdAt": "2025-11-30T12:00:00.000Z",
      "updatedAt": "2025-11-30T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Response Error (400 - Validación)

```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "msg": "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### Response Error (409 - Email duplicado)

```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

---

## 2. Inicio de Sesión

### Request

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan.perez@example.com",
  "password": "Password123"
}
```

### cURL

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@example.com",
    "password": "Password123"
  }'
```

### PowerShell

```powershell
$body = @{
    email = "juan.perez@example.com"
    password = "Password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

# Guardar token para requests posteriores
$token = $response.data.token
Write-Host "Token guardado: $token"
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan.perez@example.com",
      "phone": "1234567890",
      "createdAt": "2025-11-30T12:00:00.000Z",
      "updatedAt": "2025-11-30T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Response Error (401 - Credenciales inválidas)

```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

## 3. Obtener Perfil del Usuario Autenticado

### Request

```bash
GET http://localhost:3000/api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### cURL

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### PowerShell

```powershell
# Usando el token guardado anteriormente
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/users/profile" `
  -Method Get `
  -Headers $headers
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "phone": "1234567890",
    "createdAt": "2025-11-30T12:00:00.000Z",
    "updatedAt": "2025-11-30T12:00:00.000Z"
  }
}
```

### Response Error (401 - Sin token)

```json
{
  "success": false,
  "message": "Token de autenticación requerido"
}
```

---

## 4. Actualizar Perfil

### Request

```bash
PUT http://localhost:3000/api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "phone": "9876543210"
}
```

### Actualizar solo contraseña

```json
{
  "password": "NewPassword456"
}
```

### cURL

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan Carlos",
    "lastName": "Pérez García",
    "phone": "9876543210"
  }'
```

### PowerShell

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$body = @{
    firstName = "Juan Carlos"
    lastName = "Pérez García"
    phone = "9876543210"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/users/profile" `
  -Method Put `
  -Headers $headers `
  -ContentType "application/json" `
  -Body $body
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "Juan Carlos",
    "lastName": "Pérez García",
    "email": "juan.perez@example.com",
    "phone": "9876543210",
    "createdAt": "2025-11-30T12:00:00.000Z",
    "updatedAt": "2025-11-30T12:30:00.000Z"
  }
}
```

---

## 5. Listar Todos los Usuarios

### Request (Página 1, 10 usuarios)

```bash
GET http://localhost:3000/api/users?page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Request (Página 2, 20 usuarios)

```bash
GET http://localhost:3000/api/users?page=2&limit=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### cURL

```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### PowerShell

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$params = @{
    page = 1
    limit = 10
}

$uri = "http://localhost:3000/api/users?" + ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join '&'

Invoke-RestMethod -Uri $uri -Method Get -Headers $headers
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan.perez@example.com",
        "phone": "1234567890",
        "createdAt": "2025-11-30T12:00:00.000Z",
        "updatedAt": "2025-11-30T12:00:00.000Z"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "firstName": "María",
        "lastName": "González",
        "email": "maria.gonzalez@example.com",
        "phone": "9876543210",
        "createdAt": "2025-11-30T13:00:00.000Z",
        "updatedAt": "2025-11-30T13:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

## 6. Health Check

### Request

```bash
GET http://localhost:3000/api/health
```

### cURL

```bash
curl -X GET http://localhost:3000/api/health
```

### PowerShell

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
```

### Response (200)

```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2025-11-30T14:30:00.000Z"
}
```

---

## Colección de Postman

Puedes importar esta colección en Postman:

```json
{
  "info": {
    "name": "Users Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"Juan\",\n  \"lastName\": \"Pérez\",\n  \"email\": \"juan@example.com\",\n  \"password\": \"Password123\",\n  \"phone\": \"1234567890\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/api/auth/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"juan@example.com\",\n  \"password\": \"Password123\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/api/auth/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "http://localhost:3000/api/users/profile",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "users", "profile"]
            }
          }
        },
        {
          "name": "Update Profile",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"Juan Carlos\",\n  \"phone\": \"9876543210\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/api/users/profile",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "users", "profile"]
            }
          }
        },
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "http://localhost:3000/api/users?page=1&limit=10",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "users"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Script de Prueba Completo (PowerShell)

```powershell
# Script de prueba completa de la API

Write-Host "=== PRUEBA DE API - GESTIÓN DE USUARIOS ===" -ForegroundColor Green

# 1. Registro de usuario
Write-Host "`n1. Registrando nuevo usuario..." -ForegroundColor Yellow
$registerBody = @{
    firstName = "Test"
    lastName = "User"
    email = "test$(Get-Random -Maximum 9999)@example.com"
    password = "Test123"
    phone = "1234567890"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerBody
    
    $token = $registerResponse.data.token
    Write-Host "✓ Usuario registrado exitosamente" -ForegroundColor Green
    Write-Host "  ID: $($registerResponse.data.user.id)"
    Write-Host "  Email: $($registerResponse.data.user.email)"
} catch {
    Write-Host "✗ Error en registro: $_" -ForegroundColor Red
    exit
}

# 2. Obtener perfil
Write-Host "`n2. Obteniendo perfil..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/users/profile" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✓ Perfil obtenido exitosamente" -ForegroundColor Green
    Write-Host "  Nombre: $($profileResponse.data.firstName) $($profileResponse.data.lastName)"
} catch {
    Write-Host "✗ Error al obtener perfil: $_" -ForegroundColor Red
}

# 3. Actualizar perfil
Write-Host "`n3. Actualizando perfil..." -ForegroundColor Yellow
$updateBody = @{
    firstName = "Test Updated"
    phone = "9999999999"
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/users/profile" `
        -Method Put `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $updateBody
    
    Write-Host "✓ Perfil actualizado exitosamente" -ForegroundColor Green
    Write-Host "  Nuevo nombre: $($updateResponse.data.firstName)"
    Write-Host "  Nuevo teléfono: $($updateResponse.data.phone)"
} catch {
    Write-Host "✗ Error al actualizar perfil: $_" -ForegroundColor Red
}

# 4. Listar usuarios
Write-Host "`n4. Listando usuarios (página 1)..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/users?page=1&limit=5" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✓ Usuarios obtenidos exitosamente" -ForegroundColor Green
    Write-Host "  Total: $($usersResponse.data.pagination.total)"
    Write-Host "  Página: $($usersResponse.data.pagination.page)/$($usersResponse.data.pagination.totalPages)"
    Write-Host "  Usuarios en esta página: $($usersResponse.data.users.Count)"
} catch {
    Write-Host "✗ Error al listar usuarios: $_" -ForegroundColor Red
}

Write-Host "`n=== PRUEBA COMPLETADA ===" -ForegroundColor Green
```

Para ejecutar el script:

```powershell
.\test-api.ps1
```

---

## Ejemplo con JavaScript/Axios (Frontend)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Registro
async function register() {
  const response = await api.post('/auth/register', {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    password: 'Password123',
    phone: '1234567890',
  });
  
  localStorage.setItem('token', response.data.data.token);
  console.log('Usuario registrado:', response.data.data.user);
}

// 2. Login
async function login() {
  const response = await api.post('/auth/login', {
    email: 'juan@example.com',
    password: 'Password123',
  });
  
  localStorage.setItem('token', response.data.data.token);
  console.log('Login exitoso:', response.data.data.user);
}

// 3. Obtener perfil
async function getProfile() {
  const response = await api.get('/users/profile');
  console.log('Perfil:', response.data.data);
}

// 4. Actualizar perfil
async function updateProfile() {
  const response = await api.put('/users/profile', {
    firstName: 'Juan Carlos',
    phone: '9876543210',
  });
  console.log('Perfil actualizado:', response.data.data);
}

// 5. Listar usuarios
async function getAllUsers(page = 1, limit = 10) {
  const response = await api.get(`/users?page=${page}&limit=${limit}`);
  console.log('Usuarios:', response.data.data.users);
  console.log('Paginación:', response.data.data.pagination);
}
```

---

Este documento proporciona ejemplos completos para todas las formas de consumir la API.
