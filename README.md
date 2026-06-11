# CommodaFlow

[![Tests](https://github.com/nataliagalanalv/CommodaFlow/actions/workflows/test.yml/badge.svg)](https://github.com/nataliagalanalv/CommodaFlow/actions/workflows/test.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)

> Plataforma de gestión de alquiler de hardware para empresas y equipos.

CommodaFlow es una aplicación full-stack que permite a los usuarios explorar un catálogo de equipos tecnológicos (portátiles, tablets y periféricos), reservarlos por periodos definidos y consultar su historial de alquileres. Los administradores disponen de herramientas adicionales para gestionar el inventario.

El proyecto está compuesto por dos aplicaciones complementarias:

- **Web** — Aplicación Next.js desplegada en Vercel, accesible desde cualquier navegador.
- **Mobile** — Aplicación React Native / Expo con paridad funcional respecto a la web, disponible para iOS y Android.

Ambas consumen la misma API REST alojada en el servidor Next.js y comparten la base de usuarios mediante **Firebase Authentication**.

---

## Demo

<!-- Sustituye los enlaces de abajo cuando tengas la demo y la release publicadas -->

- **Vídeo demo técnica (5 min):** [Ver en Loom](#) <!-- TODO: pegar enlace de Loom -->
- **App web en producción:** [commoda-flow-frontend.vercel.app](https://commoda-flow-frontend.vercel.app)
- **Descarga APK (Android):** [Última release](#) <!-- TODO: pegar enlace al APK de EAS/GitHub Releases -->

<!-- Coloca aquí un GIF corto de la app funcionando: ![Demo](docs/arquitectura/demo.gif) -->

---

## Arquitectura del sistema

| Componente | Tecnología | Despliegue |
|---|---|---|
| App Móvil | Expo / React Native | EAS Build (APK) |
| App Web | Next.js (App Router) | Vercel |
| Backend / API | Next.js (Route Handlers) | Vercel |
| Base de datos | PostgreSQL | Neon (serverless) |
| Autenticación | Firebase Authentication | Firebase (Google Cloud) |
| Notificaciones | Expo Notifications (locales) | En dispositivo |

```
┌─────────────────┐         ┌─────────────────┐
│   App Web       │         │   App Móvil     │
│  (Next.js)      │         │ (React Native)  │
└────────┬────────┘         └────────┬────────┘
         │      Misma API REST       │
         └─────────────┬─────────────┘
                       ▼
         ┌─────────────────────────────┐
         │   Backend (Next.js /api/*)  │
         │   + Capa de servicios       │
         └──────┬───────────────┬──────┘
                ▼               ▼
      ┌──────────────┐   ┌──────────────┐
      │ Firebase Auth│   │   Neon DB    │
      │  (identidad) │   │ (PostgreSQL) │
      └──────────────┘   └──────────────┘
```

> El diagrama detallado está en [`docs/arquitectura/diagrama.png`](docs/arquitectura/diagrama.png) y las decisiones de arquitectura en [`docs/adr/`](docs/adr/).

---

## Tecnologías

### Web (`/`)

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| UI | React | 19.x |
| Estilos | Tailwind CSS | 4.x |
| ORM | Prisma | 6.x |
| Base de datos | PostgreSQL (Neon serverless) | — |
| Validación | Zod | — |
| Autenticación | Firebase Authentication (cliente) + Firebase Admin SDK (servidor) | — |
| Notificaciones UI | Sonner | 2.x |

### Mobile (`/mobile`)

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | React Native + Expo SDK | 54.x |
| Enrutamiento | Expo Router | 6.x |
| Estado global | Zustand + AsyncStorage | 5.x |
| Autenticación | Firebase Authentication (JS SDK) | — |
| Validación | Zod | 3.x |
| Listas | @shopify/flash-list | 2.x |
| Animaciones | React Native Reanimated | 4.x |
| Gestos | React Native Gesture Handler | 2.x |
| Notificaciones | Expo Notifications (locales) | — |
| Calendario | @react-native-community/datetimepicker | 8.x |
| Feedback táctil | expo-haptics | 15.x |
| Build | EAS Build | — |

### Calidad y testing

| Categoría | Tecnología |
|---|---|
| Tests | Jest + @testing-library/react-native (35 tests) |
| Tipado | TypeScript estricto (0 errores) |
| Linting | ESLint / Expo Lint (0 warnings) |
| Integración continua | GitHub Actions (tests automáticos en cada push) |
| Accesibilidad | Etiquetas para lectores de pantalla (VoiceOver / TalkBack) |

---

## Estructura del proyecto

```
CommodaFlow/               ← raíz del repositorio
│
├── prisma/
│   └── schema.prisma            # Modelos de la base de datos (users, Hardware, rentals)
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/       # POST: login unificado (registra o autentica)
│   │   │   │   ├── register/    # POST: registro independiente
│   │   │   │   ├── me/          # GET: introspección de sesión (cookie → usuario)
│   │   │   │   └── logout/      # POST: invalida la cookie de sesión
│   │   │   ├── hardware/        # GET: listado  |  POST: crear equipo (admin)
│   │   │   ├── rentals/
│   │   │   │   ├── route.ts     # POST: crear alquiler  |  GET: listar por userId
│   │   │   │   └── [id]/return/ # PATCH: registrar devolución (transacción atómica)
│   │   │   └── users/[id]/      # PATCH: actualizar el nombre del usuario
│   │   ├── layout.tsx           # Layout raíz: AuthProvider + Toaster
│   │   ├── page.tsx             # Pantalla principal: inventario + modal de alquiler
│   │   ├── login/               # Pantalla de login / registro
│   │   ├── record/              # Historial de alquileres del usuario
│   │   ├── profile/             # Edición de perfil
│   │   ├── addNewHardware/      # Crear equipo (solo admins)
│   │   └── not-found.tsx        # Página 404 personalizada
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AdminGuard.tsx   # HOC de protección por rol (admin)
│   │   │   └── LoginForm.tsx    # Formulario de login/registro con tabs
│   │   ├── NavWrapper.tsx       # Barra de navegación y menús de usuario
│   │   ├── InventoryList.tsx    # Grid de equipos con búsqueda y filtros
│   │   ├── HardwareCard.tsx     # Tarjeta individual de equipo
│   │   ├── RentalModal.tsx      # Modal de confirmación de alquiler
│   │   ├── FilterBar.tsx        # Filtros de estado, categoría y precio
│   │   ├── SearchBar.tsx        # Barra de búsqueda libre
│   │   ├── StatusBadge.tsx      # Badge de estado con color semántico
│   │   ├── RentalTable.tsx      # Tabla del historial de alquileres
│   │   ├── UserProfileCard.tsx  # Tarjeta de perfil con previsualización
│   │   ├── BackButton.tsx       # Botón de retorno a la pantalla principal
│   │   └── HardwareForm.tsx     # Formulario de creación de hardware
│   │
│   ├── context/
│   │   └── AuthContext.tsx      # Contexto de sesión web (usuario + token)
│   │
│   ├── hooks/
│   │   ├── useFetchHardware.ts  # Hook de carga del inventario con limpieza de efecto
│   │   └── useFetchRentals.ts   # Hook de carga de alquileres con limpieza de efecto
│   │
│   ├── lib/
│   │   ├── prisma.ts            # Singleton de PrismaClient (safe para hot-reload)
│   │   ├── firebase.ts          # Cliente Firebase Auth (navegador)
│   │   └── firebase-admin.ts    # Admin SDK: verifica ID tokens en el servidor
│   │
│   ├── middleware.ts             # Protección de rutas por cookie de sesión
│   │
│   ├── schemas/
│   │   ├── hardware.schemas.ts  # Esquema Zod para creación de hardware
│   │   └── user.schema.ts       # Esquemas Zod de registro y login
│   │
│   ├── services/
│   │   ├── hardware.service.ts  # CRUD de equipos (Prisma)
│   │   ├── rental.service.ts    # CRUD de alquileres con transacciones atómicas
│   │   └── user.service.ts      # Perfil de usuario en Neon (indexado por Firebase uid)
│   │
│   └── types/
│       ├── auth.types.ts        # AuthState, AuthResponse
│       ├── hardware.ts          # HardwareStatus, HardwareCategory, Hardware
│       ├── rental.types.ts      # RentalStatus, Rental, CreateRentalDTO
│       └── user.types.ts        # users, UserCreateInput, UpdateUserRequest
│
├── mobile/
│   ├── app/
│   │   ├── _layout.tsx          # Layout raíz: SafeAreaProvider + Stack
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx      # Guardián inverso (redirige si ya autenticado)
│   │   │   └── login.tsx        # Pantalla de inicio de sesión
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx      # Barra de pestañas con protección de acceso
│   │   │   ├── inventario.tsx   # Pantalla de inventario con filtros
│   │   │   ├── alquileres.tsx   # Actividad: alquileres activos + historial
│   │   │   └── perfil.tsx       # Perfil del usuario y edición de datos
│   │   └── nuevo-hardware.tsx   # Modal de creación de equipo (solo admins)
│   │
│   ├── components/
│   │   ├── RentalModal.tsx      # Bottom sheet de confirmación de alquiler
│   │   ├── SwipeableRow.tsx     # Fila con gesto "deslizar para devolver" (Reanimated)
│   │   └── items/
│   │       ├── HardwareCard.tsx # Tarjeta de equipo (animada con Reanimated)
│   │       └── RentalCard.tsx   # Tarjeta de alquiler para historial
│   │
│   ├── constants/
│   │   ├── api.ts               # URL base de la API (dev/prod)
│   │   └── theme.ts             # Paleta de colores, tipografía y espaciado
│   │
│   ├── lib/
│   │   ├── firebase.ts          # Firebase Auth con persistencia en AsyncStorage
│   │   └── notifications.ts     # Recordatorios locales de devolución
│   │
│   ├── store/
│   │   ├── authStore.ts         # Estado de sesión con persistencia en AsyncStorage
│   │   ├── hardwareStore.ts     # Estado del inventario con persistencia offline
│   │   └── rentalStore.ts       # Estado de alquileres con persistencia offline
│   │
│   ├── types/
│   │   └── index.ts             # Tipos compartidos + type guards (isOverdue, isAvailable)
│   │
│   └── __tests__/               # 35 tests (unitarios + integración) con Jest
│
├── public/                      # Assets estáticos (logos, iconos SVG)
├── tailwind.config.ts           # Configuración de Tailwind CSS
├── tsconfig.json                # Configuración TypeScript
└── package.json                 # Dependencias y scripts del proyecto web
```

---

## Modelo de datos

```
users              Hardware          rentals
────────────────   ──────────────    ────────────────
id (Firebase uid)  id (uuid PK)      id (uuid PK)
name               model             userId → users
email (unique)     specs             hardwareId → Hardware
role               category          startDate
createdAt          dailyRate         endDate
avatarUrl?         status            totalPrice
                   createdAt         status
```

> Las contraseñas **no se almacenan** en la base de datos: las gestiona Firebase Authentication. La tabla `users` usa el `uid` de Firebase como clave primaria, enlazando la identidad (Firebase) con los datos de negocio (Neon).

**Enumerados:**
- `Role`: `USER` | `ADMIN`
- `Category`: `LAPTOP` | `TABLET` | `PERIPHERAL`
- `Status` (Hardware/Rental): `AVAILABLE` | `RENTED` | `MAINTENANCE` | `RETURNED`

---

## Prerrequisitos

Antes de instalar el proyecto, asegúrate de tener:

- **Node.js** ≥ 20.x y **npm** ≥ 10.x
- **Git**
- Una base de datos **PostgreSQL** accesible (recomendado: [Neon](https://neon.tech) para entorno serverless)

Para el desarrollo de la app móvil:
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** instalado en tu dispositivo iOS o Android (para desarrollo sin simulador)  
  *o* simuladores nativos configurados (Xcode para iOS, Android Studio para Android)

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd CommodaFlow
```

### 2. Configurar el proyecto web

```bash
# Instalar dependencias
npm install

# Crear el archivo de variables de entorno
cp .env.example .env
```

Edita `.env` con los siguientes valores:

```env
# Cadena de conexión de tu base de datos PostgreSQL (Neon u otra)
DATABASE_URL="postgresql://usuario:contraseña@host/nombre_db?sslmode=require"

# Clave secreta para firmar los tokens JWT (mínimo 32 caracteres)
JWT_SECRET="tu_clave_secreta_aqui"
```

```bash
# Generar el cliente Prisma y aplicar el esquema a la base de datos
npx prisma db push

# Iniciar el servidor de desarrollo
npm run dev
```

El servidor arrancará en `http://localhost:3000`.

> **Producción:** Despliega en [Vercel](https://vercel.com) conectando el repositorio y configurando las mismas variables de entorno en el panel de proyecto.

### 3. Configurar la app móvil

```bash
cd mobile

# Instalar dependencias
npm install
```

Edita `mobile/constants/api.ts` y configura la URL base:

```ts
// Desarrollo local (Expo Go en la misma red WiFi que el PC):
// Ejecuta `ipconfig` en Windows para obtener tu IPv4
export const API_URL = 'http://192.168.X.X:3000';

// Producción (cuando el servidor esté desplegado en Vercel):
// export const API_URL = 'https://tu-proyecto.vercel.app';
```

```bash
# Iniciar Expo
npm start

# O directamente en plataforma específica:
npm run android
npm run ios
```

Escanea el código QR con la app **Expo Go** en tu dispositivo para cargar la aplicación.

> **Nota:** las funciones nativas (notificaciones, animaciones y gestos) requieren un **Development Build** de EAS en lugar de Expo Go. Genéralo con `eas build --profile development --platform android` y arranca con `npx expo start --dev-client`.

---

## Testing y calidad

La aplicación móvil incluye una suite de **35 tests** con Jest (unitarios y de integración).

```bash
cd mobile

npm test               # ejecuta todos los tests
npm run test:coverage  # tests con informe de cobertura
npm run test:watch     # modo interactivo (re-ejecuta al guardar)
```

Verificaciones de calidad (ambos proyectos):

```bash
npx tsc --noEmit       # comprobación de tipos (0 errores)
npx eslint src         # linting de la web (0 warnings)
cd mobile && npm run lint   # linting del móvil (0 warnings)
```

Cada `push` o `pull request` a `main` ejecuta automáticamente estos chequeos mediante **GitHub Actions** (ver [`.github/workflows/test.yml`](.github/workflows/test.yml)).

---

## Uso

### Roles de usuario

| Rol | Capacidades |
|---|---|
| **USER** | Explorar inventario, crear alquileres, consultar y gestionar su historial, editar su perfil |
| **ADMIN** | Todo lo anterior + crear nuevos equipos en el inventario |

### Flujo principal

1. **Registro / Login** — Crea una cuenta o accede con tus credenciales. El primer usuario puede configurarse como `ADMIN` directamente en la base de datos cambiando el campo `role`.

2. **Inventario** — Explora el catálogo de equipos disponibles. Usa la barra de búsqueda y los filtros (estado, categoría, precio) para encontrar lo que necesitas.

3. **Alquilar un equipo** — Pulsa sobre un equipo disponible para abrir el modal de confirmación. Selecciona las fechas de inicio y fin; el precio total se calcula automáticamente según la tarifa diaria.

4. **Gestionar alquileres** — En la sección de historial (web: "Historial", móvil: pestaña "Alquileres") puedes ver tus alquileres activos y registrar la devolución cuando termines de usar el equipo.

5. **Perfil** — Actualiza tu nombre y contraseña desde la pantalla de perfil. Los cambios se reflejan inmediatamente en toda la aplicación.

6. **Añadir hardware (admins)** — Los administradores disponen del botón "Añadir equipo" para registrar nuevos equipos en el inventario directamente desde la web o la app móvil.

### API REST

Todos los endpoints están bajo `/api/` y requieren autenticación (excepto `/api/auth/login` y `/api/auth/register`):

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | Sincroniza sesión: verifica el ID token de Firebase y devuelve el perfil de Neon |
| `POST` | `/api/auth/register` | Crea el perfil en Neon tras el alta en Firebase |
| `GET` | `/api/auth/me` | Datos del usuario autenticado |
| `POST` | `/api/auth/logout` | Cierre de sesión |
| `GET` | `/api/hardware` | Listado completo de equipos |
| `POST` | `/api/hardware` | Crear equipo (admin) |
| `POST` | `/api/rentals` | Crear alquiler |
| `GET` | `/api/rentals?userId=<id>` | Alquileres del usuario |
| `PATCH` | `/api/rentals/:id/return` | Registrar devolución |
| `PATCH` | `/api/users/:id` | Actualizar el nombre del usuario |

**Autenticación con Firebase:**
- El **login y registro** se realizan en el cliente con el SDK de Firebase (web y móvil), que devuelve un **ID token**.
- El **backend verifica** ese token con el Firebase Admin SDK antes de crear la sesión y devolver el perfil del usuario.
- **Web** — La sesión se mantiene en una cookie HttpOnly con el `uid` de Firebase.
- **Mobile** — La sesión persiste en AsyncStorage mediante el store de Zustand.
- El **cambio de contraseña** se hace directamente contra Firebase, no contra esta API.
