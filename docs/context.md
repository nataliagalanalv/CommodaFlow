# Gestión de Estado Global con Context API

En **CommodaFlow**, se utiliza React Context API para gestionar información que debe ser accesible desde cualquier punto de la aplicación sin recurrir al *Prop Drilling*.

## 1. Arquitectura de Autenticación (`Auth`)

SE ha dividido la lógica de autenticación en tres archivos para cumplir con las reglas de **Fast Refresh** de Vite:

| Archivo | Responsabilidad |
| :--- | :--- |
| `AuthContext.ts` | Define la interfaz TypeScript y crea el objeto de contexto básico. |
| `AuthProvider.tsx` | Contiene el estado (`useState`) y la lógica de login/logout. Envuelve la aplicación. |
| `useAuth.ts` | Hook personalizado para que los componentes consuman los datos de forma segura. |

## 2. Implementación Técnica

### Definición del Contexto
El contexto define qué datos "flotan" en la aplicación:
- `user`: Datos del perfil activo.
- `isAuthenticated`: Estado binario de la sesión.
- `login/logout`: Funciones para modificar el estado global.

### El Hook `useAuth`
Este hook incluye una validación de seguridad crítica:

```typescript
if (context === undefined) {
  throw new Error('useAuth debe usarse dentro de un AuthProvider');
}

```

Esto evita errores silenciosos si intentamos acceder a la sesión en un componente que no está envuelto por el Provider.

## 3. Rendimiento

- **Consumo selectivo:** Solo los componentes que llaman a useAuth() se renderizarán de nuevo cuando el usuario cambie.
- **Ubicación del Provider:** Se sitúa en App.tsx para garantizar que la Navbar y las futuras rutas tengan acceso inmediato a la sesión.

## 4. Cuándo es útil usar Context API

Context API no es una solución para "todo" el estado de la aplicación, sino una herramienta para datos transversales. Es útil principalmente en tres escenarios:

1. **Eliminación del Prop Drilling:** Cuando necesitas pasar un dato (como el usuario actual) a un componente que está 4 o 5 niveles más abajo, y los componentes intermedios no usan ese dato para nada.
2. **Datos Globales Auténticos:** Información que define el comportamiento de toda la interfaz:
    - Autenticación: ¿Quién está logueado?
    - Tematización (Theming): Modo oscuro o claro
    - Localización: ¿Idioma español o inglés?
3. **Estado Persistente pero Volátil:** Datos que deben sobrevivir mientras el usuario navega entre páginas, pero que no necesariamente necesitan guardarse en una base de datos pesada cada segundo.

