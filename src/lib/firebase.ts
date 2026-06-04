import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Configuración del cliente Firebase para la aplicación web de CommodaFlow.
 * Los valores se leen de variables de entorno con prefijo NEXT_PUBLIC_ para
 * que Next.js los incluya en el bundle del navegador.
 */
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

/**
 * Instancia única de la app Firebase (patrón singleton).
 * `getApps().length` evita reinicializar si el módulo se importa varias veces
 * durante el hot-reload de Next.js.
 */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/** Instancia de Firebase Auth lista para usar en componentes y pages. */
export const auth = getAuth(app);

export default app;
