import * as Notifications from 'expo-notifications';
import { scheduleReturnReminder } from '../../lib/notifications';

/**
 * Tests del helper de notificaciones.
 * `expo-notifications` está mockeado en jest.setup.js para no requerir
 * permisos del SO ni programar notificaciones reales.
 */

describe('scheduleReturnReminder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Por defecto el permiso está concedido (definido en el mock)
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
  });

  it('programa una notificación para una fecha futura', async () => {
    const future = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
    const id = await scheduleReturnReminder('MacBook Pro', future);

    expect(id).toBe('notif-id');
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
  });

  it('NO programa nada si la fecha ya pasó', async () => {
    const past = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
    const id = await scheduleReturnReminder('MacBook Pro', past);

    expect(id).toBeNull();
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('NO programa nada si el permiso está denegado', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    const future = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
    const id = await scheduleReturnReminder('MacBook Pro', future);

    expect(id).toBeNull();
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('incluye el modelo del equipo en el cuerpo de la notificación', async () => {
    const future = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
    await scheduleReturnReminder('iPad Air', future);

    const callArg = (Notifications.scheduleNotificationAsync as jest.Mock).mock.calls[0][0];
    expect(callArg.content.body).toContain('iPad Air');
  });
});
