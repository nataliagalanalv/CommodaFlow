# ADR 0003 — Firebase Auth + PostgreSQL (Neon) en lugar de todo en Firebase

**Estado:** Aceptada
**Fecha:** 2026

## Contexto

CommodaFlow necesita dos cosas distintas:

1. **Gestionar la identidad** de los usuarios: registro, inicio de sesión, cifrado
   de contraseñas y sesión persistente, tanto en web como en móvil.
2. **Almacenar los datos de negocio**: inventario de hardware y alquileres, que
   tienen relaciones claras entre sí (un alquiler pertenece a un usuario y a un
   equipo).

Se barajó usar **un único servicio** (Firebase, con Authentication + Firestore como
base de datos) o **separar responsabilidades** entre dos servicios especializados.

## Decisión

Separar las dos responsabilidades:

- **Firebase Authentication** para la identidad (login, registro, contraseñas, sesión).
- **PostgreSQL en Neon**, con el ORM **Prisma**, para los datos de negocio.

El enlace entre ambos mundos es el **`uid` de Firebase**, que se guarda como clave
primaria del usuario en la tabla `users` de PostgreSQL.

## Alternativas consideradas

- **Todo en Firebase (Auth + Firestore):** descartada principalmente por el modelo de
  datos. Firestore es una base de datos NoSQL orientada a documentos, y los datos de
  CommodaFlow son **relacionales**: un alquiler referencia a un usuario y a un equipo,
  y se necesitan operaciones consistentes entre ellos (por ejemplo, marcar un alquiler
  como devuelto y liberar el equipo a la vez). Modelar y mantener esa consistencia en
  Firestore es más complejo y propenso a errores que en una base relacional.
- **Autenticación propia (JWT + cifrado manual con bcrypt):** se llegó a implementar en
  una fase inicial, pero se sustituyó por Firebase. Gestionar credenciales de forma
  segura (cifrado, protección frente a ataques, recuperación de contraseña) es difícil
  y arriesgado de hacer a mano; delegarlo en un proveedor especializado es más seguro y
  es práctica habitual en la industria.

## Decisión razonada

Cada herramienta hace aquello en lo que es mejor:

- Firebase resuelve la seguridad de las credenciales, que no conviene reinventar.
- PostgreSQL modela de forma natural las relaciones y permite **transacciones
  atómicas**, que CommodaFlow usa al crear y devolver alquileres.

El backend (Next.js) actúa de puente: el cliente se autentica con Firebase y obtiene
un **ID token**; el servidor **verifica ese token** con el Firebase Admin SDK y, a
partir del `uid`, consulta o crea el perfil del usuario en Neon.

```ts
// El servidor nunca confía en el cliente: siempre verifica el token
const decoded = await getAdminAuth().verifyIdToken(idToken);
const user = await UserService.getById(decoded.uid); // perfil en Neon
```

## Consecuencias

**Positivas**
- Seguridad de credenciales delegada en un servicio probado.
- Base de datos relacional con integridad referencial y transacciones.
- **Base de usuarios compartida** entre web y móvil de forma transparente: el mismo
  `uid` identifica al usuario en ambas plataformas.
- Separación de responsabilidades clara: identidad vs. datos de negocio.

**Negativas**
- Hay que coordinar **dos servicios** en lugar de uno, y mantener sincronizados el
  `uid` de Firebase y el registro de Neon (al registrarse se crea en ambos).
- Dependencia de dos proveedores externos (Firebase y Neon) en lugar de uno.
- El despliegue requiere configurar credenciales de ambos servicios como variables
  de entorno (tanto en local como en Vercel).
