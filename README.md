# 🚀 CommodaFlow (Next.js Edition)

**CommodaFlow** es una plataforma integral para la gestión y alquiler de hardware, ahora migrada a una arquitectura de **Fullstack Next.js**. El sistema centraliza la lógica de negocio, la API y el frontend en un único entorno robusto, utilizando **Neon** como base de datos relacional.

## 🛠️ Stack Tecnológico

* **Framework:** [Next.js 14+](https://nextjs.org/) (App Router).
* **Lenguaje:** TypeScript (Strict Mode).
* **Base de Datos:** [PostgreSQL en Neon](https://neon.tech/).
* **ORM:** [Prisma](https://www.prisma.io/).
* **Validación:** [Zod](https://zod.dev/).
* **Seguridad:** [bcryptjs](https://www.npmjs.com/package/bcryptjs) para hashing de credenciales.
* **Estilos:** Tailwind CSS.

---

## 🏗️ Arquitectura del Sistema

Siguiendo principios de **Arquitectura de Capas**, hemos separado las responsabilidades para garantizar la escalabilidad:

1.  **`/src/app/api` (Handlers):** Solo gestionan la recepción de peticiones HTTP, la validación de entrada con Zod y la respuesta al cliente.
2.  **`/src/services` (Business Logic):** Aquí reside la inteligencia de la aplicación. Interactúan con la base de datos a través de Prisma.
3.  **`/src/schemas` (Validation):** Contratos de datos compartidos entre el cliente y el servidor.
4.  **`/src/lib` (Config):** Configuraciones globales como el Singleton de Prisma.

---

## ⚙️ Configuración del Proyecto

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz de `commoda-flow-next/` con tu cadena de conexión de Neon:

```env
DATABASE_URL="postgres://tu_usuario:tu_password@tu-cluster.neon.tech/neondb?sslmode=require"
```
### 2. Instalación y Sincronización

# Instalar dependencias
npm install

# Generar el cliente de Prisma
npx prisma generate

# Sincronizar el schema con la base de datos de Neon
npx prisma db push

### 3. Scripts Disponibles

* npm run dev: Inicia el servidor de desarrollo.
* npx prisma studio: Abre una interfaz visual para gestionar tus datos en Neon.
* npx prisma db seed: Población inicial de la base de datos (vía ts-node).

## 📁 Estructura de Carpetas Actualizada

src/
├── app/
│   ├── api/             # Endpoints (Auth, Hardware, Rentals)
│   └── (frontend)/      # Vistas de la aplicación (Page, Layout)
├── services/            # Lógica de negocio tipada (HardwareService, etc.)
├── schemas/             # Validaciones Zod (user.schema, hardware.schema)
├── lib/                 # prisma.ts (Singleton)
└── components/          # Componentes de UI reutilizables
prisma/
└── schema.prisma        # Definición de modelos y relaciones SQL

## 🔒 Seguridad e Integridad

* **Autenticación:** Las contraseñas nunca se almacenan en texto plano; se utiliza bcryptjs con un factor de coste de 10.

* **Transacciones:** Todas las operaciones de alquiler que afectan a múltiples tablas (crear registro + actualizar estado de hardware) se ejecutan mediante Transacciones de Prisma (prisma.$transaction) para garantizar la integridad de los datos.

## 📝 Notas de Migración

Se ha eliminado la separación de carpetas frontend/ y server/ externas, unificando todo el flujo en el proyecto Next.js para mejorar el despliegue (Vercel) y la coherencia de tipos entre cliente y servidor.
