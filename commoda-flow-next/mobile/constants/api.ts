// ── Configuración de la URL base de la API ────────────────────────────────────
//
// DESARROLLO LOCAL (Expo Go en el mismo WiFi que el PC):
//   Usa la IP local de tu máquina. Ejecuta `ipconfig` en Windows y busca tu IPv4.
//   Asegúrate de tener `npm run dev` ejecutándose en commoda-flow-next/.
//   Ejemplo: 'http://192.168.1.135:3000'
//
// PRODUCCIÓN (Vercel):
//   Cambia a tu URL de Vercel cuando el servidor local no esté corriendo.
//   Ejemplo: 'https://commoda-flow-next.vercel.app'
//
/**
 * URL base de la API de CommodaFlow.
 *
 * La aplicación móvil consume la misma API REST que la versión web.
 * A diferencia del navegador (que usa rutas relativas como `/api/...`),
 * React Native necesita la URL completa con host y puerto.
 *
 * ### Cambio de entorno
 * | Entorno       | Valor a configurar                          |
 * |---------------|---------------------------------------------|
 * | Desarrollo    | `http://<TU_IP_LOCAL>:3000`                 |
 * | Producción    | `https://<tu-proyecto>.vercel.app`          |
 *
 * @remarks
 * El token del usuario se incluye en cada petición como cabecera
 * `Authorization: Bearer <token>` (almacenado en `authStore`).
 */
export const API_URL = 'http://192.168.1.135:3000';
