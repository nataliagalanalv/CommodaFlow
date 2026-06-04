import admin from 'firebase-admin';

/**
 * Inicialización lazy del Firebase Admin SDK para el servidor Next.js.
 *
 * La inicialización NO ocurre al importar el módulo, sino la primera vez que
 * se llama a `getAdminAuth()`. Esto evita que el build de producción crashee
 * durante la fase de "collect page data", cuando las variables de entorno aún
 * no están necesariamente disponibles al evaluar el módulo.
 *
 * Las credenciales se leen de variables de entorno del servidor (sin prefijo
 * NEXT_PUBLIC_) para que NUNCA se expongan al cliente.
 */
function getAdminApp(): admin.app.App {
  if (admin.apps.length) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Faltan variables de entorno de Firebase Admin (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)'
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      // Las barras invertidas literales del .env se convierten a saltos de línea reales
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

/**
 * Devuelve la instancia de Firebase Auth del Admin SDK, inicializándola
 * de forma perezosa en la primera llamada.
 *
 * @returns Instancia de `admin.auth.Auth` para verificar ID tokens en el servidor.
 *
 * @example
 * ```ts
 * const decoded = await getAdminAuth().verifyIdToken(idToken);
 * ```
 */
export function getAdminAuth(): admin.auth.Auth {
  return getAdminApp().auth();
}

export default admin;
