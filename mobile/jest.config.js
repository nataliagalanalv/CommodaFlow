/**
 * Configuración de Jest para la aplicación móvil CommodaFlow.
 *
 * Usa el preset `jest-expo`, que configura el entorno de React Native + Expo
 * (mocks de módulos nativos, transformaciones de Babel, etc.).
 *
 * ### transformIgnorePatterns
 * Por defecto Jest no transforma `node_modules`, pero muchas librerías de
 * React Native/Expo se distribuyen como ESM sin transpilar. Este patrón
 * fuerza la transformación de esos paquetes (Firebase, Reanimated, Gesture
 * Handler, etc.) para que Jest pueda importarlos sin errores de sintaxis.
 */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|' +
      'expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|' +
      'react-navigation|@react-navigation/.*|@shopify/.*|' +
      'react-native-reanimated|react-native-gesture-handler|' +
      'react-native-worklets|firebase|@firebase/.*))',
  ],
  collectCoverageFrom: [
    'store/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/node_modules/**',
  ],
};
