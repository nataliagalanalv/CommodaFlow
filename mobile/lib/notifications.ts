import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Configura el comportamiento de las notificaciones cuando la app está en
 * primer plano. Por defecto, las notificaciones no se muestran si la app
 * está abierta; con este handler sí se muestran como banner con sonido.
 *
 * Se llama una vez al arrancar la app (en el layout raíz).
 */
export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Solicita permiso al usuario para enviar notificaciones.
 *
 * En Android 13+ y en iOS el sistema requiere permiso explícito. Si el usuario
 * ya lo concedió antes, no vuelve a mostrar el diálogo.
 *
 * @returns `true` si el permiso está concedido, `false` en caso contrario.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;

  if (existing !== 'granted') {
    const result = await Notifications.requestPermissionsAsync();
    status = result.status;
  }

  // En Android es necesario crear un canal de notificación para que se muestren
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Recordatorios de alquiler',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#3D70DD',
    });
  }

  return status === 'granted';
}

/**
 * Programa una notificación local que recuerda al usuario la devolución de un
 * equipo, a las 10:00 de la mañana, con la antelación elegida.
 *
 * @param model      - Modelo del equipo alquilado (para el cuerpo de la notificación).
 * @param endDate    - Fecha de fin del alquiler en formato ISO (`YYYY-MM-DD`).
 * @param daysBefore - Días de antelación respecto a la fecha de fin:
 *                     `0` = el mismo día de la devolución, `1` = el día anterior.
 * @returns El identificador de la notificación programada, o `null` si no se
 *          programó (permiso denegado, fecha inválida o ya pasada).
 */
export async function scheduleReturnReminder(
  model: string,
  endDate: string,
  daysBefore: number = 0
): Promise<string | null> {
  const granted = await requestNotificationPermission();
  if (!granted) return null;

  // Recordatorio a las 10:00, restando los días de antelación elegidos
  const triggerDate = new Date(endDate + 'T10:00:00');
  triggerDate.setDate(triggerDate.getDate() - daysBefore);
  if (isNaN(triggerDate.getTime()) || triggerDate.getTime() <= Date.now()) {
    return null;
  }

  // El cuerpo cambia según se avise el mismo día o el día anterior
  const body = daysBefore === 0
    ? `Hoy vence el alquiler de "${model}". No olvides devolverlo.`
    : `Mañana vence el alquiler de "${model}". Prepárate para devolverlo.`;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '📦 Devolución de equipo',
      body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });

  return id;
}
