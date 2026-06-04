import { initializeApp, getApps, getApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
// @ts-expect-error — getReactNativePersistence existe en runtime pero no está en los tipos exportados
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Configuración del cliente Firebase para la aplicación móvil CommodaFlow.
 * Usa los mismos valores que la versión web (mismo proyecto Firebase) para
 * que la base de usuarios sea compartida entre web y móvil.
 */
const firebaseConfig = {
  apiKey: 'AIzaSyBPLEY7N1F7uy7MyG9FGqCWNxm5HlvjTdQ',
  authDomain: 'commodaflow-a4a81.firebaseapp.com',
  projectId: 'commodaflow-a4a81',
  storageBucket: 'commodaflow-a4a81.firebasestorage.app',
  messagingSenderId: '1008838146153',
  appId: '1:1008838146153:web:ecaae1b059ba865dc88af8',
};

/** Instancia única de la app Firebase (singleton). */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * Instancia de Firebase Auth con persistencia en AsyncStorage.
 *
 * En React Native, `getAuth()` no persiste la sesión entre reinicios de la app.
 * Por eso se usa `initializeAuth` con `getReactNativePersistence(AsyncStorage)`,
 * que guarda el token de sesión de forma persistente.
 *
 * El `try/catch` evita el error "auth already initialized" durante el
 * fast-refresh de desarrollo: si ya existe, se reutiliza con `getAuth`.
 */
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };
export default app;
