# CommodaFlow

> Plataforma de gestión de alquiler de hardware para empresas y equipos.

CommodaFlow es una aplicación full-stack que permite a los usuarios explorar un catálogo de equipos tecnológicos (portátiles, tablets y periféricos), reservarlos por periodos definidos y consultar su historial de alquileres. Los administradores disponen de herramientas adicionales para gestionar el inventario.

El proyecto está compuesto por dos aplicaciones complementarias:

- **Web** — Aplicación Next.js desplegada en Vercel, accesible desde cualquier navegador.
- **Mobile** — Aplicación React Native / Expo con paridad funcional respecto a la web, disponible para iOS y Android.

Ambas consumen la misma API REST alojada en el servidor Next.js.

---

## Tecnologías

### Web (`/`)

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.6 |
| UI | React | 19.2.4 |
| Estilos | Tailwind CSS | 4.x |
| ORM | Prisma | 6.x |
| Base de datos | PostgreSQL (Neon serverless) | — |
| Validación | Zod | — |
| Autenticación | Cookie HttpOnly (`token-commoda`) + bcryptjs | — |
| Notificaciones | Sonner | 2.x |
| IDs | UUID v4 | 14.x |

### Mobile (`/mobile`)

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | React Native + Expo SDK | 54.x |
| Enrutamiento | Expo Router | 6.x |
| Estado global | Zustand + AsyncStorage | 5.x |
| Validación | Zod | 3.x |
| Listas | @shopify/flash-list | 2.x |
| Calendario | @react-native-community/datetimepicker | 8.x |
| Feedback táctil | expo-haptics | 15.x |

---

## Estructura del proyecto

```
commoda-flow-next/
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
│   │   │   └── users/[id]/      # PATCH: actualizar nombre y/o contraseña
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
│   │   └── prisma.ts            # Singleton de PrismaClient (safe para hot-reload)
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
│   │   └── user.service.ts      # CRUD de usuarios con hashing de contraseña
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
│   │   └── items/
│   │       ├── HardwareCard.tsx # Tarjeta de equipo para FlashList
│   │       └── RentalCard.tsx   # Tarjeta de alquiler para historial
│   │
│   ├── constants/
│   │   ├── api.ts               # URL base de la API (dev/prod)
│   │   └── theme.ts             # Paleta de colores, tipografía y espaciado
│   │
│   ├── store/
│   │   ├── authStore.ts         # Estado de sesión con persistencia en AsyncStorage
│   │   ├── hardwareStore.ts     # Estado del inventario con persistencia offline
│   │   └── rentalStore.ts       # Estado de alquileres con persistencia offline
│   │
│   └── types/
│       └── index.ts             # Tipos compartidos + type guards (isOverdue, isAvailable)
│
├── public/                      # Assets estáticos (logos, iconos SVG)
├── tailwind.config.ts           # Configuración de Tailwind CSS
├── tsconfig.json                # Configuración TypeScript
└── package.json                 # Dependencias y scripts del proyecto web
```

---

## Modelo de datos

```
users           Hardware          rentals
─────────────   ──────────────    ────────────────
id (uuid PK)    id (uuid PK)      id (uuid PK)
name            model             userId → users
email (unique)  specs             hardwareId → Hardware
password        category          startDate
role            dailyRate         endDate
createdAt       status            totalPrice
avatarUrl?      createdAt         status
```

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
cd commoda-flow-next
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
| `POST` | `/api/auth/login` | Login o registro unificado |
| `POST` | `/api/auth/register` | Registro independiente |
| `GET` | `/api/auth/me` | Datos del usuario autenticado |
| `POST` | `/api/auth/logout` | Cierre de sesión |
| `GET` | `/api/hardware` | Listado completo de equipos |
| `POST` | `/api/hardware` | Crear equipo (admin) |
| `POST` | `/api/rentals` | Crear alquiler |
| `GET` | `/api/rentals?userId=<id>` | Alquileres del usuario |
| `PATCH` | `/api/rentals/:id/return` | Registrar devolución |
| `PATCH` | `/api/users/:id` | Actualizar nombre y/o contraseña |

**Autenticación:**
- **Web** — Cookie HttpOnly `token-commoda` gestionada automáticamente por el navegador.
- **Mobile** — Cabecera `Authorization: Bearer <token>` en todas las peticiones.
