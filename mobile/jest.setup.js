/**
 * Setup global de Jest para CommodaFlow.
 *
 * Aquí se "mockean" (simulan) los módulos nativos y servicios externos que no
 * existen en el entorno de test de Node. Un mock sustituye la dependencia real
 * por una versión controlada para que los tests sean deterministas y no
 * dependan de red, permisos del SO ni hardware.
 */

// AsyncStorage: mock oficial en memoria
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Módulo local de Firebase: evitamos inicializar Firebase real en los tests
jest.mock('./lib/firebase', () => ({
  auth: {},
}));

// Funciones de Firebase Auth usadas en stores y pantallas
jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  updatePassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// expo-haptics: feedback táctil (no hay hardware en los tests)
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: { Success: 'success' },
}));

// expo-notifications: notificaciones locales
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notif-id')),
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DATE: 'date' },
}));

// Silencia el warning de act() de algunas animaciones en los tests
global.__DEV__ = true;
