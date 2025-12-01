# Gestión de Usuarios - Frontend

Aplicación web desarrollada con React, TypeScript, Vite y React Router para la gestión de usuarios. Consume la API REST del backend.

## Tecnologías Utilizadas

- **React** v18.2 - Biblioteca de UI
- **TypeScript** v5.2 - Tipado estático
- **Vite** v5.0 - Build tool y dev server ultrarrápido
- **React Router** v6.20 - Enrutamiento SPA
- **Axios** v1.6 - Cliente HTTP
- **CSS3** - Estilos personalizados (sin frameworks)

## Prerrequisitos

- Node.js v18 o superior
- npm o yarn
- Backend API corriendo en `http://localhost:3000`

## Instalación y Configuración

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar variables de entorno (opcional)

Crear archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

Por defecto, la API URL es `http://localhost:3000/api`.

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 4. Compilar para producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

### 5. Preview de producción

```bash
npm run preview
```

## Funcionalidades

### Autenticación

- **Registro de usuarios**: Formulario con validación completa
- **Inicio de sesión**: Autenticación con email y password
- **Persistencia de sesión**: Token guardado en localStorage
- **Cierre de sesión**: Limpieza segura de datos

### Dashboard

- **Visualización de perfil**: Datos del usuario autenticado
- **Edición de perfil**: Actualizar nombre, teléfono y contraseña
- **Lista de usuarios**: Ver todos los usuarios registrados
- **Paginación**: Navegación eficiente por usuarios

### Características Adicionales

- **Rutas protegidas**: Solo usuarios autenticados acceden al dashboard
- **Manejo de errores**: Mensajes claros y amigables
- **Estados de carga**: Feedback visual durante operaciones
- **Diseño responsive**: Funciona en móvil, tablet y desktop
- **Validación de formularios**: Cliente y servidor

## Estructura del Proyecto

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx    # HOC para rutas protegidas
│   ├── context/
│   │   └── AuthContext.tsx       # Context API para autenticación
│   ├── pages/
│   │   ├── Login.tsx             # Página de login
│   │   ├── Register.tsx          # Página de registro
│   │   └── Dashboard.tsx         # Dashboard principal
│   ├── services/
│   │   └── api.ts                # Configuración de Axios y servicios API
│   ├── styles/
│   │   ├── App.css               # Estilos globales
│   │   ├── Auth.css              # Estilos de autenticación
│   │   └── Dashboard.css         # Estilos del dashboard
│   ├── App.tsx                   # Componente raíz con rutas
│   ├── main.tsx                  # Punto de entrada
│   └── vite-env.d.ts             # Tipos de Vite
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Decisiones Técnicas

### ¿Por qué React?

- **Componentes reutilizables**: Código modular y mantenible
- **Ecosistema robusto**: Amplia comunidad y librerías
- **Virtual DOM**: Rendimiento optimizado
- **Hooks**: Lógica compartible entre componentes

### ¿Por qué Vite?

- **Velocidad**: HMR instantáneo en desarrollo
- **Build optimizado**: Rollup para producción
- **Configuración mínima**: Out-of-the-box TypeScript support
- **Moderno**: ES modules nativos

### ¿Por qué Context API en lugar de Redux?

- **Simplicidad**: Suficiente para el alcance del proyecto
- **Sin dependencias externas**: Parte de React
- **Curva de aprendizaje**: Más fácil de entender
- **Performance adecuada**: Para estados simples como auth

### ¿Por qué Axios en lugar de Fetch?

- **Interceptores**: Manejo centralizado de tokens y errores
- **Transformación automática**: JSON parsing automático
- **Mejor manejo de errores**: Estructura más clara
- **TypeScript support**: Tipado más robusto

### Arquitectura de Componentes

```
App (Router)
└── AuthProvider (Context)
    ├── Login
    ├── Register
    └── ProtectedRoute
        └── Dashboard
```

### Gestión de Estado

- **Estado global (autenticación)**: Context API
- **Estado local (formularios)**: useState hooks
- **Estado de servidor (usuarios)**: Peticiones Axios

### Estilos CSS

- **CSS Vanilla**: Sin frameworks para demostrar dominio de CSS
- **Variables CSS**: Paleta de colores centralizada
- **Flexbox y Grid**: Layouts modernos
- **Responsive design**: Mobile-first approach

## 📱 Responsive Breakpoints

```css
/* Mobile: < 640px (default) */
/* Tablet: 640px - 768px */
/* Desktop: > 768px */
```

## Seguridad

### Implementada

- Tokens JWT en headers Authorization
- Validación de formularios cliente-side
- Sanitización de inputs
- Rutas protegidas con redirección
- Auto-logout en token expirado
- HTTPS ready (producción)

### Mejoras Futuras

- [ ] CSRF tokens
- [ ] Content Security Policy
- [ ] XSS protection mejorada
- [ ] Rate limiting visual

## Uso de la Aplicación

### 1. Registro

1. Ir a `/register`
2. Completar formulario:
   - Nombre y apellido (min 2 caracteres)
   - Email válido
   - Contraseña (min 6 caracteres, con mayúscula, minúscula y número)
   - Teléfono (opcional, 10-20 dígitos)
3. Confirmar contraseña
4. Clic en "Crear Cuenta"
5. Redirección automática al Dashboard

### 2. Login

1. Ir a `/login`
2. Ingresar email y contraseña
3. Clic en "Iniciar Sesión"
4. Redirección al Dashboard

### 3. Dashboard

**Ver Perfil:**
- Visualizar datos personales
- Ver fecha de registro

**Editar Perfil:**
1. Clic en "Editar Perfil"
2. Modificar campos deseados
3. Opcionalmente cambiar contraseña
4. Clic en "Guardar Cambios"

**Ver Usuarios:**
- Lista completa de usuarios registrados
- Navegación por páginas (10 usuarios por página)
- Información: nombre, email, teléfono, fecha de registro

**Cerrar Sesión:**
- Clic en "Cerrar Sesión"
- Limpieza de datos locales
- Redirección a Login

## Mejoras Futuras

### Corto Plazo

- [ ] Tests con React Testing Library
- [ ] Tests E2E con Playwright
- [ ] Debouncing en búsquedas
- [ ] Toast notifications (react-hot-toast)
- [ ] Skeleton loaders

### Mediano Plazo

- [ ] Búsqueda y filtros de usuarios
- [ ] Ordenamiento de tabla de usuarios
- [ ] Dark mode
- [ ] Internacionalización (i18n)
- [ ] PWA (Progressive Web App)
- [ ] Subida de avatar

### Largo Plazo

- [ ] Chat en tiempo real (WebSockets)
- [ ] Notificaciones push
- [ ] Gráficas y analytics
- [ ] Exportar datos a CSV/PDF
- [ ] Storybook para componentes

## Paleta de Colores

```css
--primary-color: #4f46e5      /* Índigo */
--primary-hover: #4338ca      /* Índigo oscuro */
--secondary-color: #6b7280    /* Gris */
--background: #f9fafb         /* Gris claro */
--card-background: #ffffff    /* Blanco */
--text-primary: #111827       /* Negro */
--text-secondary: #6b7280     /* Gris medio */
--success-color: #10b981      /* Verde */
--error-color: #ef4444        /* Rojo */
```

## Debugging

### Problemas Comunes

**Error de conexión con API:**
```
Error: Network Error
```
Solución: Verificar que el backend esté corriendo en `http://localhost:3000`

**Token expirado:**
```
Error: Token inválido o expirado
```
Solución: Volver a iniciar sesión. Los tokens expiran según `JWT_EXPIRES_IN` del backend.

**CORS error:**
```
Error: CORS policy
```
Solución: Verificar configuración de CORS en el backend (`cors` middleware).

## Convenciones de Código

- **Nomenclatura**: 
  - Componentes: PascalCase (Login.tsx)
  - Funciones/variables: camelCase (handleSubmit)
  - CSS classes: kebab-case (auth-container)
- **Imports**: Orden alfabético por categoría
- **Comentarios**: JSDoc para componentes y funciones complejas
- **Props destructuring**: Siempre en parámetros de componentes

