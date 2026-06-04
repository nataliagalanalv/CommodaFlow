import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { configureNotificationHandler } from '../lib/notifications';

/**
 * Layout raíz de la aplicación móvil CommodaFlow.
 *
 * Define la estructura de navegación de nivel superior mediante Expo Router:
 * - `(auth)`         → grupo de pantallas sin autenticación (login).
 * - `(tabs)`         → grupo de pestañas para usuarios autenticados.
 * - `nuevo-hardware` → pantalla modal para crear equipos (solo admins).
 *
 * ### GestureHandlerRootView
 * Envuelve toda la app — es REQUERIDO por `react-native-gesture-handler`
 * para que los gestos (como el swipe-to-delete del historial) funcionen.
 * Debe ser el componente más externo del árbol.
 *
 * ### Notificaciones
 * Configura el handler de notificaciones al arrancar (vía `useEffect`) para
 * que los recordatorios de devolución se muestren incluso con la app abierta.
 *
 * ### Adaptación a modo oscuro
 * Lee el esquema de color del sistema con `useColorScheme` para ajustar la
 * barra de estado y el fondo del header de la pantalla modal.
 *
 * ### SafeAreaProvider
 * Da acceso a los insets del dispositivo (notch, barra de navegación) a los
 * componentes que usan `SafeAreaView`.
 */
export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];

  // Configura el comportamiento de las notificaciones una sola vez al arrancar
  useEffect(() => {
    configureNotificationHandler();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="nuevo-hardware"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Añadir equipo',
              headerStyle: { backgroundColor: theme.surface },
              headerTintColor: theme.primary,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
