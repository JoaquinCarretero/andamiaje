# Implementación de Redux en Andamiaje

Este documento explica cómo se ha implementado Redux Toolkit en la aplicación Andamiaje para manejar el estado de autenticación de forma global y robusta.

## Estructura de Redux

### Archivos Principales

```
src/
├── store/
│   ├── index.ts                    # Configuración del store
│   ├── provider.tsx                # Provider de Redux para Next.js
│   └── slices/
│       └── authSlice.ts            # Slice de autenticación
├── components/
│   └── auth/
│       ├── AuthInitializer.tsx     # Inicializa la sesión al cargar la app
│       └── ProtectedRoute.tsx      # HOC para proteger rutas
└── hooks/
    └── useAuthRedux.ts             # Hook personalizado para usar auth
```

## Configuración del Store

El store está configurado en `src/store/index.ts` y exporta:

- `store`: Instancia del store de Redux
- `RootState`: Tipo TypeScript para el estado global
- `AppDispatch`: Tipo TypeScript para el dispatch
- `useAppDispatch`: Hook tipado para usar dispatch
- `useAppSelector`: Hook tipado para seleccionar estado

## Estado de Autenticación

El slice de autenticación (`authSlice.ts`) maneja el siguiente estado:

```typescript
interface AuthState {
  user: UserI | null;           // Datos del usuario actual
  isAuthenticated: boolean;     // Si el usuario está autenticado
  loading: boolean;             // Si hay una operación en curso
  error: string | null;         // Mensaje de error si existe
  initialized: boolean;         // Si se completó la inicialización
}
```

## Thunks Disponibles

### loginThunk

Maneja el proceso de login:

```typescript
import { loginThunk } from '@/store/slices/authSlice';

const handleLogin = async () => {
  try {
    await dispatch(loginThunk({ documentNumber, password })).unwrap();
    // Login exitoso - redirección automática
  } catch (error) {
    // Manejar error
  }
};
```

### registerThunk

Maneja el proceso de registro:

```typescript
import { registerThunk } from '@/store/slices/authSlice';

const handleRegister = async () => {
  try {
    await dispatch(registerThunk(formData)).unwrap();
    // Registro exitoso - redirección automática
  } catch (error) {
    // Manejar error
  }
};
```

### getProfileThunk

Obtiene el perfil del usuario actual:

```typescript
import { getProfileThunk } from '@/store/slices/authSlice';

useEffect(() => {
  dispatch(getProfileThunk());
}, []);
```

### updateProfileThunk

Actualiza el perfil del usuario:

```typescript
import { updateProfileThunk } from '@/store/slices/authSlice';

const updateProfile = async () => {
  try {
    await dispatch(updateProfileThunk({
      userId: user.id,
      updates: { firstLogin: false, hasSignature: true }
    })).unwrap();
  } catch (error) {
    // Manejar error
  }
};
```

## Acciones Síncronas

### logout

Limpia el estado de autenticación:

```typescript
import { logout } from '@/store/slices/authSlice';

const handleLogout = () => {
  dispatch(logout());
  router.push('/login');
};
```

### clearError

Limpia el mensaje de error:

```typescript
import { clearError } from '@/store/slices/authSlice';

dispatch(clearError());
```

### updateUser

Actualiza los datos del usuario en el estado:

```typescript
import { updateUser } from '@/store/slices/authSlice';

dispatch(updateUser({ firstName: 'Nuevo Nombre' }));
```

## Uso en Componentes

### Con useAppSelector y useAppDispatch

```typescript
import { useAppSelector, useAppDispatch } from '@/store';
import { loginThunk, clearError } from '@/store/slices/authSlice';

function LoginComponent() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async () => {
    try {
      await dispatch(loginThunk(formData)).unwrap();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    // JSX
  );
}
```

### Con Hook Personalizado

```typescript
import { useAuthRedux } from '@/hooks/useAuthRedux';

function MyComponent() {
  const { user, isAuthenticated, loading, logout } = useAuthRedux();

  return (
    // JSX
  );
}
```

## Protección de Rutas

Las rutas protegidas usan el componente `ProtectedRoute`:

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types/auth';

export default function TerapeutaPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.TERAPEUTA]}>
      {/* Contenido de la página */}
    </ProtectedRoute>
  );
}
```

Características de `ProtectedRoute`:
- Muestra un spinner mientras se inicializa la sesión
- Redirige a `/login` si no hay sesión activa
- Redirige a `/login` si el usuario no tiene el rol permitido
- Permite especificar múltiples roles permitidos

## Inicialización de Sesión

El componente `AuthInitializer` se ejecuta al cargar la aplicación:

```typescript
// En src/app/layout.tsx
<ReduxProvider>
  <AuthInitializer />
  {children}
</ReduxProvider>
```

Este componente:
1. Intenta obtener el perfil del usuario al cargar
2. Si tiene cookies válidas, establece la sesión
3. Si no hay sesión válida, deja el estado como no autenticado
4. Marca el estado como `initialized` al terminar

## Flujo de Autenticación

### Login

1. Usuario envía credenciales desde `/login`
2. Se dispara `loginThunk`
3. La API responde con código 204 y establece cookies HttpOnly
4. Se llama automáticamente a `/auth/profile` para obtener datos del usuario
5. Los datos del usuario se guardan en Redux
6. La página de login redirige según el rol del usuario

### Validación en Cada Carga

1. `AuthInitializer` intenta obtener el perfil
2. Si hay cookies válidas, se obtienen los datos del usuario
3. Si no hay cookies o son inválidas, el usuario permanece no autenticado
4. Las rutas protegidas verifican `isAuthenticated` y `user.role`

### Logout

1. Usuario hace click en logout
2. Se dispara la acción `logout`
3. El estado de Redux se limpia
4. Se redirige a `/login`
5. Las cookies HttpOnly permanecen hasta que expiren (el backend las gestiona)

## Diferencias con el Sistema Anterior

### Antes (localStorage + useAuth)

- Estado local en cada componente
- Múltiples llamadas a `isAuthenticated()` causaban consultas repetidas
- Datos del usuario en localStorage (inseguro)
- Estado inconsistente entre páginas

### Ahora (Redux)

- Estado global centralizado
- Una sola inicialización al cargar la app
- Datos del usuario solo en memoria (más seguro)
- Estado consistente en toda la aplicación
- No hay sobreconsultas al backend
- Mejor experiencia de usuario (sin flickers)

## Mejoras de Seguridad

1. **No hay tokens en el frontend**: Las cookies HttpOnly son gestionadas completamente por el backend
2. **No hay datos persistentes en el cliente**: El estado de Redux se limpia al cerrar la pestaña
3. **Validación en cada recarga**: Se verifica la sesión con el backend al cargar la app
4. **Protección de rutas**: Las rutas verifican autenticación y roles antes de renderizar

## Troubleshooting

### El usuario no se mantiene al recargar

Esto es esperado si las cookies han expirado. El `AuthInitializer` intentará obtener el perfil pero fallará si no hay cookies válidas.

### Las redirecciones no funcionan

Verifica que:
1. El `AuthInitializer` esté en el layout raíz
2. Las páginas protegidas usen `ProtectedRoute`
3. El `initialized` sea `true` antes de redirigir

### Estado desincronizado

Si el estado parece desincronizado:
1. Verifica que no estés usando `AuthService` directamente (usa Redux)
2. Asegúrate de que todos los componentes lean de Redux
3. Limpia el localStorage manualmente si hay datos antiguos

## Próximas Mejoras

1. Implementar refresh token automático
2. Agregar persistencia opcional con Redux Persist
3. Implementar notificaciones toast para errores de auth
4. Agregar métricas de rendimiento
