import admin from 'firebase-admin';

/**
 * Singleton del Firebase Admin SDK para el servidor Next.js.
 *
 * Se inicializa una sola vez gracias a `admin.apps.length`.
 * Las credenciales se leen de variables de entorno del servidor (sin
 * prefijo NEXT_PUBLIC_) para que NUNCA se expongan al cliente.
 *
 * ### Uso
 * ```ts
 * import { adminAuth } from '@/lib/firebase-admin';
 * const decoded = await adminAuth.verifyIdToken(token);
 * ```
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      // Las barras invertidas literales del .env se convierten a saltos de línea reales
      privateKey:  process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}

/** Instancia de Firebase Auth del Admin SDK para verificar tokens en el servidor. */
export const adminAuth = admin.auth();

export default admin;
