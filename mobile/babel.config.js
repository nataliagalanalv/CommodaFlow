/**
 * Configuración de Babel para la aplicación móvil CommodaFlow.
 *
 * El plugin `react-native-worklets/plugin` es REQUERIDO por Reanimated 4:
 * transforma las funciones marcadas como "worklets" para que se ejecuten en
 * el hilo de UI nativo (no en el hilo de JavaScript), permitiendo animaciones
 * y gestos fluidos a 60 FPS.
 *
 * ⚠️ Debe ser el ÚLTIMO plugin de la lista.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-worklets/plugin'],
  };
};
