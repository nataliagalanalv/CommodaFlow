import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';

/**
 * Layout raíz de la aplicación móvil CommodaFlow.
 *
 * Define la estructura de navegación de nivel superior mediante Expo Router:
 * - `(auth)`         → grupo de pantallas sin autenticación (login).
 * - `(tabs)`         → grupo de pestañas para usuarios autenticados.
 * - `nuevo-hardware` → pantalla modal para crear equipos (solo admins).
 *
 * ### Adaptación a modo oscuro
 * Lee el esquema de color del sistema con `useColorScheme` para:
 * - Ajustar el estilo de la barra de estado (`light`/`dark`).
 * - Aplicar el color de fondo correcto al header de la pantalla modal.
 *
 * ### SafeAreaProvider
 * Envuelve toda la app para que los componentes que usan `SafeAreaView`
 * tengan acceso a los insets del dispositivo (notch, barra de navegación, etc.).
 */
export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];

  return (
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
  );
}
