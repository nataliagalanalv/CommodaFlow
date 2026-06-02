import { PrismaClient } from '@prisma/client'

/**
 * Singleton de `PrismaClient` adaptado al entorno de Next.js.
 *
 * ### Por qué es necesario
 * Next.js ejecuta los route handlers en modo "hot reload" durante el desarrollo,
 * lo que provoca que el módulo se re-evalúe repetidamente. Sin esta técnica,
 * cada recarga crearía una nueva instancia de `PrismaClient` y agotaría el pool
 * de conexiones de la base de datos PostgreSQL (Neon).
 *
 * ### Cómo funciona
 * - Se guarda la instancia en `globalThis`, que persiste entre recarga de módulos.
 * - En producción (`NODE_ENV === 'production'`) no se almacena en `globalThis`
 *   porque el servidor no hace hot-reload; cada invocación de función edge/lambda
 *   parte de un proceso nuevo.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/** Instancia compartida de Prisma. Importar siempre desde aquí, nunca crear `new PrismaClient()` directamente. */
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
